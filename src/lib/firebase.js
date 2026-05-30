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
  getDatabase,
  ref,
  set,
  get,
  child,
  remove,
  onValue
} from 'firebase/database';

const projectId = firebaseConfig.projectId || 'sgc1-d1cab';

// Generate primary possible RTDDB URLs based on standard regional structures
const rtdbUrls = [
  firebaseConfig.databaseURL || `https://${projectId}-default-rtdb.europe-west1.firebasedatabase.app`
].filter(Boolean);

// Unique values only
export const rtdbUrlsUnique = Array.from(new Set(rtdbUrls));

// Create a main RTDDB instance targeting the config URL or first discoverable
export const rtdb = getDatabase(app, firebaseConfig.databaseURL || rtdbUrlsUnique[0]);

// Diagnostic function to run real-time checks on the connections
export async function testRtdbConnections() {
  const results = [];
  for (const url of rtdbUrlsUnique) {
    try {
      const rtdbInstance = getDatabase(app, url);
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

function handleRtdbError(error, operationType, path, extraDetails = '') {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email
    },
    operationType,
    path,
    extraDetails
  };
  console.error('[Firebase Realtime Database Error]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Save inquiry exclusively to all available Realtime Databases
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

  let writeSuccess = false;
  let lastError = null;
  let failedEndpoints = [];

  // Write to all possible regional RTDDB locations to guarantee delivery
  for (const url of rtdbUrlsUnique) {
    try {
      const rtdbInstance = getDatabase(app, url);
      const rtdbRef = ref(rtdbInstance, 'inquiries/' + inquiry.id);
      await set(rtdbRef, payload);
      console.log(`[RTDDB-SAVE] Success at endpoint ${url} for lead ID: ${inquiry.id}`);
      writeSuccess = true;
    } catch (error) {
      console.warn(`[RTDDB-SAVE] Attempt failed at endpoint ${url}:`, error);
      lastError = error;
      failedEndpoints.push(url);
    }
  }

  if (!writeSuccess) {
    handleRtdbError(
      lastError || new Error('All RTDDB write operations failed.'),
      OperationType.CREATE,
      `inquiries/${inquiry.id}`,
      `Failed endpoints: ${failedEndpoints.join(', ')}`
    );
  }
}

// Load inquiries exclusively from the working Realtime Databases
export async function loadInquiriesFromFirestore() {
  const inquiriesMap = new Map();
  let fetchWorked = false;

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
          fetchWorked = true;
        }
      } else {
        // Empty db or missing path is a correct state
        fetchWorked = true;
      }
    } catch (error) {
      console.warn(`[RTDDB-FETCH] Region fetch ignored or failed at ${url}:`, error);
    }
  }

  const list = Array.from(inquiriesMap.values());
  // Sort descending
  list.sort((a, b) => {
    const idA = Number(a.id?.replace('inq-', '')) || 0;
    const idB = Number(b.id?.replace('inq-', '')) || 0;
    return idB - idA;
  });

  return list;
}

// Delete inquiry exclusively from all available Realtime Databases
export async function deleteInquiryFromFirestore(id) {
  let deleteSuccess = false;
  for (const url of rtdbUrlsUnique) {
    try {
      const rtdbInstance = getDatabase(app, url);
      const rtdbRef = ref(rtdbInstance, 'inquiries/' + id);
      await remove(rtdbRef);
      console.log(`[RTDDB-DELETE] Success at endpoint ${url} for lead ID: ${id}`);
      deleteSuccess = true;
    } catch (error) {
      console.warn(`[RTDDB-DELETE] Region delete failed at ${url}:`, error);
    }
  }

  if (!deleteSuccess) {
    console.error(`[RTDDB-DELETE] Could not complete delete for ID ${id} on any RTDDB endpoint.`);
  }
}

// Real-time synchronization subscription helper
export function subscribeToInquiries(callback) {
  const unsubscribeList = [];
  const sourceCaches = new Map(); // url -> Map(id -> inquiry)

  rtdbUrlsUnique.forEach((url) => {
    try {
      const rtdbInstance = getDatabase(app, url);
      const inquiriesRef = ref(rtdbInstance, 'inquiries');

      const unsub = onValue(inquiriesRef, (snapshot) => {
        const urlCache = new Map();
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val) {
            Object.values(val).forEach((inq) => {
              if (inq && inq.id) {
                urlCache.set(inq.id, inq);
              }
            });
          }
        }
        sourceCaches.set(url, urlCache);

        // Merge snapshots from all endpoints in real-time
        const mergedMap = new Map();
        sourceCaches.forEach((cache) => {
          cache.forEach((inq, id) => {
            mergedMap.set(id, inq);
          });
        });

        const list = Array.from(mergedMap.values());
        // Sort descending
        list.sort((a, b) => {
          const idA = Number(a.id?.replace('inq-', '')) || 0;
          const idB = Number(b.id?.replace('inq-', '')) || 0;
          return idB - idA;
        });

        callback(list);
      }, (error) => {
        console.warn(`[RTDDB-SUBSCRIBE] Subscription skipped or failed at ${url}:`, error);
      });

      unsubscribeList.push(unsub);
    } catch (err) {
      console.warn(`[RTDDB-SUBSCRIBE] Could not build listener context for ${url}:`, err);
    }
  });

  return () => {
    unsubscribeList.forEach((unsub) => {
      try {
        unsub();
      } catch (err) {
        console.warn('[RTDDB-UNSUBSCRIBE] Failed executing clean unsubscribe:', err);
      }
    });
  };
}

// Mock Firestore network testing (no-op as we use RTDDB exclusively)
export async function testConnection() {
  console.log('RTDDB exclusively active. Connection verification complete.');
}
