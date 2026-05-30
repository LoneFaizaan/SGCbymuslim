import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics if supported in the current environment
export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((err) => {
  console.warn('Analytics initialization skipped:', err);
});

export const provider = new GoogleAuthProvider();
// Request the full Google Sheets scope to create and update lead spreadsheets
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
// Request the Gmail send scope to notify the admin when an inquiry/appointment is made
provider.addScope('https://www.googleapis.com/auth/gmail.send');

// Flag to indicate if we are currently signing in
let isSigningIn = false;
// Cache the access token in memory (never persist in localStorage for security)
let cachedAccessToken = null;

// Initialize auth state listener. Call this on app load or header load.
export const initAuth = (onAuthSuccess, onAuthFailure) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token is not cached yet (e.g. initial pagereload), we need to request login or wait for action
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Google OAuth Sign In Trigger
export const googleSignIn = async () => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to extract Google Workspace OAuth access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Firebase Google Sign-In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve token in-memory
export const getAccessToken = async () => {
  return cachedAccessToken;
};

// Log Out Trigger
export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  remove
} from 'firebase/database';

const projectId = firebaseConfig.projectId || 'sgc1-d1cab';

// Generate primary possible RTDDB URLs based on standard regional structures
const rtdbUrls = [
  firebaseConfig.databaseURL,
  `https://${projectId}-default-rtdb.firebaseio.com`,
  `https://${projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`,
  `https://${projectId}-default-rtdb.europe-west1.firebasedatabase.app`
].filter(Boolean);

// Unique values only
export const rtdbUrlsUnique = Array.from(new Set(rtdbUrls));

// Helper to get fallback RTDDB instance if databaseURL is provided
export const rtdb = getDatabase(app, firebaseConfig.databaseURL || rtdbUrlsUnique[0]);

// Diagnostic function to run real-time checks on the connections
export async function testRtdbConnections() {
  const results = [];
  for (const url of rtdbUrlsUnique) {
    try {
      const rtdbInstance = getDatabase(app, url);
      // Attempt checking connection info plus a quick mock inquiry write/read test
      const testRef = ref(rtdbInstance, 'verification_probe');
      await set(testRef, { lastChecked: Date.now(), client: 'sgc_portal' });
      const snap = await get(testRef);
      
      results.push({
        url,
        region: url.includes('asia-southeast1') ? 'Asia (Singapore)' : url.includes('europe-west1') ? 'Europe (Belgium)' : 'US Central',
        status: snap.exists() ? 'success' : 'limited',
        details: 'Connected successfully. Read & Write permitted!'
      });
    } catch (err) {
      const errMsg = err.message || String(err);
      if (errMsg.toUpperCase().includes('PERMISSION_DENIED') || errMsg.toLowerCase().includes('permission denied')) {
        results.push({
          url,
          region: url.includes('asia-southeast1') ? 'Asia (Singapore)' : url.includes('europe-west1') ? 'Europe (Belgium)' : 'US Central',
          status: 'permission_denied',
          details: 'Permission Denied! Check your RTDDB Security Rules in Firebase Console under Rules tab. Change rules to {".read": true, ".write": true} for testing.'
        });
      } else {
        results.push({
          url,
          region: url.includes('asia-southeast1') ? 'Asia (Singapore)' : url.includes('europe-west1') ? 'Europe (Belgium)' : 'US Central',
          status: 'failed',
          details: errMsg.length > 80 ? errMsg.substring(0, 80) + '...' : errMsg
        });
      }
    }
  }
  return results;
}

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore/RealtimeDB Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation function to test firestore connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Save inquiry to Firestore and Realtime Database
export async function saveInquiryToFirestore(inquiry) {
  const payload = {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email || '',
    phone: inquiry.phone,
    businessSection: inquiry.businessSection,
    message: inquiry.message,
    date: inquiry.date,
    syncedToSheets: !!inquiry.syncedToSheets,
    status: inquiry.status || 'new',
    adminNotes: inquiry.adminNotes || ''
  };

  // 1. Save to Cloud Firestore
  try {
    await setDoc(doc(db, 'inquiries', inquiry.id), payload);
    console.log('Saved inquiry to Cloud Firestore:', inquiry.id);
  } catch (error) {
    console.error('Firestore save failed:', error);
  }

  // 2. Save to all available Realtime Databases
  for (const url of rtdbUrlsUnique) {
    try {
      const rtdbInstance = getDatabase(app, url);
      const rtdbRef = ref(rtdbInstance, 'inquiries/' + inquiry.id);
      await set(rtdbRef, payload);
      console.log(`Saved inquiry to Realtime Database successfully at ${url}:`, inquiry.id);
    } catch (error) {
      console.warn(`Realtime Database save failed at ${url}:`, error);
    }
  }
}

// Load inquiries from both Firestore & Realtime Database and merge them
export async function loadInquiriesFromFirestore() {
  const path = 'inquiries';
  const inquiriesMap = new Map();

  // 1. Attempt loading from each possible Realtime Database URLs
  for (const url of rtdbUrlsUnique) {
    try {
      const rtdbInstance = getDatabase(app, url);
      const rtdbRef = ref(rtdbInstance);
      const snapshot = await get(child(rtdbRef, 'inquiries'));
      if (snapshot.exists()) {
        const rtdbData = snapshot.val();
        if (rtdbData) {
          Object.values(rtdbData).forEach((inq) => {
            if (inq && inq.id) {
              inquiriesMap.set(inq.id, inq);
            }
          });
          console.log(`Loaded ${inquiriesMap.size} inquiries from RTDDB at ${url}.`);
        }
      }
    } catch (error) {
      console.warn(`Realtime Database fetch failed at ${url}:`, error);
    }
  }

  // 2. Attempt loading from Cloud Firestore and merge (preventing loss of older data)
  try {
    const snapshot = await getDocs(collection(db, path));
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (data && data.id) {
        inquiriesMap.set(data.id, data);
      }
    });
    console.log(`Merged with Firestore inquiries, total unique inquiries: ${inquiriesMap.size}`);
  } catch (error) {
    console.error('Firestore fetch failed:', error);
    // If RTDDB was successful, we don't crash the whole UI
    if (inquiriesMap.size === 0) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }

  return Array.from(inquiriesMap.values());
}

// Delete inquiry from both Firestore & Realtime Database
export async function deleteInquiryFromFirestore(id) {
  // 1. Delete from Firestore
  try {
    await deleteDoc(doc(db, 'inquiries', id));
    console.log('Deleted inquiry from Cloud Firestore:', id);
  } catch (error) {
    console.error('Firestore delete failed:', error);
  }

  // 2. Delete from all available Realtime Databases
  for (const url of rtdbUrlsUnique) {
    try {
      const rtdbInstance = getDatabase(app, url);
      const rtdbRef = ref(rtdbInstance, 'inquiries/' + id);
      await remove(rtdbRef);
      console.log(`Deleted inquiry from Realtime Database at ${url}:`, id);
    } catch (error) {
      console.warn(`Realtime Database delete failed at ${url}:`, error);
    }
  }
}
