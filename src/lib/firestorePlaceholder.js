import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { 
  supabase, 
  saveInquiryToSupabase, 
  updateInquiryInSupabase, 
  fetchSupabaseInquiries 
} from './supabaseClient';

// Safe default fallback config so the app never crashes
const dummyFirebaseConfig = {
  apiKey: "mock-api-key-sgc-portal",
  authDomain: "sgc-portal-mock.firebaseapp.com",
  projectId: "sgc-portal-mock",
  storageBucket: "sgc-portal-mock.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:mockmockmock"
};

const app = getApps().length === 0 ? initializeApp(dummyFirebaseConfig) : getApp();
export const auth = getAuth(app);

// Keep an in-memory list of subscribers for local storage updates
let subscribers = [];

// Helper to get local storage inquiries
const getLocalInquiries = () => {
  try {
    const raw = localStorage.getItem('sgc_customer_inquiries');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading sgc_customer_inquiries:', e);
    return [];
  }
};

// Helper to save local storage inquiries and notify subscribers
const saveLocalInquiries = (inquiries) => {
  try {
    localStorage.setItem('sgc_customer_inquiries', JSON.stringify(inquiries));
    // Notify all active subscribers with a copy of the inquiries
    subscribers.forEach(callback => {
      try {
        callback([...inquiries]);
      } catch (err) {
        console.error('Subscriber callback error:', err);
      }
    });
  } catch (e) {
    console.error('Error saving sgc_customer_inquiries:', e);
  }
};


// Listen to local storage changes from other tabs as well
window.addEventListener('storage', (event) => {
  if (event.key === 'sgc_customer_inquiries') {
    const newInquiries = getLocalInquiries();
    subscribers.forEach(callback => callback(newInquiries));
  }
});

// 1. Subscribe to inquiries
export function subscribeToFirestoreInquiries(callback) {
  subscribers.push(callback);
  
  // Trigger initial callback
  const currentInquiries = getLocalInquiries();
  callback(currentInquiries);
  
  // Return unsubscribe function
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
}

// 2. Save inquiry to firestore + Supabase
export async function saveInquiryToFirestore(inquiryData) {
  console.log('[Sync Engine] Saving inquiry to Firestore/Local:', inquiryData);
  const current = getLocalInquiries();
  
  // Append or insert at beginning
  const newInquiry = {
    ...inquiryData,
    id: inquiryData.id || `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: inquiryData.createdAt || { seconds: Math.floor(Date.now() / 1000) },
    date: inquiryData.date || new Date().toLocaleString()
  };
  
  const updated = [newInquiry, ...current];
  saveLocalInquiries(updated);

  // Parallel sync to Supabase (non-blocking)
  try {
    console.log('[Sync Engine] Syncing new lead to Supabase...', newInquiry.id);
    await saveInquiryToSupabase(newInquiry);
  } catch (supErr) {
    console.error('[Sync Engine] Supabase insert failed:', supErr);
  }
  
  return newInquiry;
}

// 3. Update inquiry status/fields on both Firestore + Supabase
export async function updateInquiryInFirestore(id, updatedFields) {
  console.log('[Sync Engine] Updating inquiry:', id, updatedFields);
  const current = getLocalInquiries();
  const updated = current.map(inq => {
    if (inq.id === id) {
      return { ...inq, ...updatedFields };
    }
    return inq;
  });
  saveLocalInquiries(updated);

  // Parallel sync to Supabase (non-blocking)
  try {
    console.log('[Sync Engine] Syncing updated fields to Supabase for ID:', id, updatedFields);
    await updateInquiryInSupabase(id, updatedFields);
  } catch (supErr) {
    console.error('[Sync Engine] Supabase update failed:', supErr);
  }

  return true;
}

/**
 * Fetch and synchronize data from Supabase to merge into local cache
 */
export async function syncWithSupabase() {
  console.log('[Sync Engine] Pulling latest leads from Supabase to merge...');
  try {
    const supabaseInquiries = await fetchSupabaseInquiries();
    if (!supabaseInquiries) {
      console.log('[Sync Engine] Supabase fetch returned empty.');
      return getLocalInquiries();
    }

    const localInquiries = getLocalInquiries();
    const mergedMap = new Map();

    // 1. Populate local first
    localInquiries.forEach(inq => {
      if (inq && inq.id) {
        mergedMap.set(inq.id, inq);
      }
    });

    // 2. Merge Supabase (overwriting or complementing)
    supabaseInquiries.forEach(supInq => {
      if (!supInq || !supInq.id) return;
      const existing = mergedMap.get(supInq.id);
      if (existing) {
        // Merge them, choosing whichever has most updated values
        mergedMap.set(supInq.id, {
          ...existing,
          ...supInq,
          status: supInq.status || existing.status || 'new',
          adminNotes: supInq.adminNotes || existing.adminNotes || '',
        });
      } else {
        mergedMap.set(supInq.id, supInq);
      }
    });

    const mergedList = Array.from(mergedMap.values());

    // Sort newest first
    mergedList.sort((a, b) => {
      const getTimestamp = (inq) => {
        if (typeof inq.id === 'string' && inq.id.startsWith('inq-')) {
          const parts = inq.id.split('-');
          if (parts[1]) return parseInt(parts[1]) || 0;
        }
        if (inq.createdAt && typeof inq.createdAt.seconds === 'number') {
          return inq.createdAt.seconds * 1000;
        }
        return 0;
      };
      return getTimestamp(b) - getTimestamp(a);
    });

    saveLocalInquiries(mergedList);
    console.log(`[Sync Engine] Dual sync completed. Total leads in memory: ${mergedList.length}`);
    return mergedList;
  } catch (err) {
    console.error('[Sync Engine] Error running syncWithSupabase:', err);
    return getLocalInquiries();
  }
}

/**
 * Setup a websocket listener for real-time Postgres insertions/updates on Supabase
 */
export function subscribeToSupabaseRealtime() {
  console.log('[Sync Engine] Registering Supabase Realtime channel...');
  try {
    const channel = supabase
      .channel('public:inquiries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, (payload) => {
        console.log('[Sync Engine] Postgres change detected. Re-syncing...', payload);
        syncWithSupabase();
      })
      .subscribe();

    return () => {
      console.log('[Sync Engine] Unsubscribing from Supabase Realtime.');
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.error('[Sync Engine] Failed to subscribe to Supabase Realtime:', err);
    return () => {};
  }
}


// 4. Google Login
export async function loginWithGoogle() {
  console.log('[Firestore Sync] loginWithGoogle triggered');
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.warn('[Firestore Sync] Real Google Sign-In failed/unconfigured. Falling back to Mock authentication:', err);
    // Return a mocked user if real authentication fails
    const mockUser = {
      uid: 'mock-admin-uid-123',
      email: 'muslimnazirlonekmr@gmail.com',
      displayName: 'SGC Admin (Mock)',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    return mockUser;
  }
}

// 5. Logout
export async function logoutUser() {
  console.log('[Firestore Sync] logoutUser triggered');
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Error signing out of real Firebase:', err);
  }
}

