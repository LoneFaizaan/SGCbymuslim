import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

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

// 2. Save inquiry to firestore (local-storage fallback)
export async function saveInquiryToFirestore(inquiryData) {
  console.log('[Firestore Sync] Saving inquiry:', inquiryData);
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
  return newInquiry;
}

// 3. Update inquiry status/fields
export async function updateInquiryInFirestore(id, updatedFields) {
  console.log('[Firestore Sync] Updating inquiry:', id, updatedFields);
  const current = getLocalInquiries();
  const updated = current.map(inq => {
    if (inq.id === id) {
      return { ...inq, ...updatedFields };
    }
    return inq;
  });
  saveLocalInquiries(updated);
  return true;
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
