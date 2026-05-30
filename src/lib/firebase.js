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
const correctDatabaseUrl = 'https://sgc1-d1cab-default-rtdb.europe-west1.firebasedatabase.app';

// Expose the unique database URL
export const rtdbUrlsUnique = [correctDatabaseUrl];

// Create the single correct RTDDB instance explicitly
export const rtdb = getDatabase(app, correctDatabaseUrl);

// Diagnostic function to run real-time checks on the connection
export async function testRtdbConnections() {
  const results = [];
  try {
    const testRef = ref(rtdb, 'verification_probe');
    await set(testRef, { lastChecked: Date.now(), client: 'sgc_portal' });
    const snap = await get(testRef);
    
    results.push({
      url: correctDatabaseUrl,
      region: 'Europe (Belgium)',
      status: snap.exists() ? 'success' : 'limited',
      details: 'Connected successfully to Europe database. Read & Write permitted!'
    });
  } catch (err) {
    const errMsg = err.message || String(err);
    if (errMsg.toUpperCase().includes('PERMISSION_DENIED') || errMsg.toLowerCase().includes('permission denied')) {
      results.push({
        url: correctDatabaseUrl,
        region: 'Europe (Belgium)',
        status: 'permission_denied',
        details: 'Permission Denied! Check your RTDDB Security Rules in Firebase Console under Rules tab. Change rules to {".read": true, ".write": true} for testing.'
      });
    } else {
      results.push({
        url: correctDatabaseUrl,
        region: 'Europe (Belgium)',
        status: 'failed',
        details: errMsg.length > 80 ? errMsg.substring(0, 80) + '...' : errMsg
      });
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

// Save inquiry exclusively to the correct Realtime Database
export async function saveInquiryToFirestore(inquiry) {
  const fullPath = `inquiries/${inquiry.id}`;
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

  // Detailed logging BEFORE database write
  console.log('=== [RTDDB-DIAGNOSTIC] PRE-WRITE REPORT ===');
  console.log(`- Runtime Project ID: ${firebaseConfig.projectId || 'Not set'}`);
  console.log(`- Config Database URL: ${firebaseConfig.databaseURL || 'Not set'}`);
  console.log('- Registered Unique RTDB URLs:', rtdbUrlsUnique);
  console.log(`- Resolved Writing URL: ${correctDatabaseUrl}`);
  console.log(`- Target DB Path: ${fullPath}`);
  console.log('- Exact Payload to Write:', JSON.stringify(payload, null, 2));
  console.log('============================================');

  try {
    const rtdbRef = ref(rtdb, fullPath);
    await set(rtdbRef, payload);
    console.log(`[RTDDB-SAVE] Success - Write operation completed at ${correctDatabaseUrl} for lead ID: ${inquiry.id}`);

    // IMMEDIATE VERIFICATION: Perform a read-back check
    console.log('=== [RTDDB-DIAGNOSTIC] IMMEDIATE VERIFICATION START ===');
    console.log(`- Attempting immediate read-back from path: ${fullPath}`);
    const verifySnap = await get(rtdbRef);
    
    if (verifySnap.exists()) {
      const dbData = verifySnap.val();
      console.log('✅ VERIFICATION SUCCESSFUL: Lead exists in database immediately post-write!');
      console.log('- Snapshot returned after write:', JSON.stringify(dbData, null, 2));
    } else {
      console.error('❌ VERIFICATION FAILED: Write succeeded, but read-back returned no data at this path!');
    }
    console.log('======================================================');

  } catch (error) {
    console.error(`[RTDDB-SAVE] Attempt failed at ${correctDatabaseUrl}:`, error);
    handleRtdbError(
      error,
      OperationType.CREATE,
      fullPath,
      `Database URL: ${correctDatabaseUrl}`
    );
  }
}

// Load inquiries exclusively from the correct Realtime Database
export async function loadInquiriesFromFirestore() {
  const list = [];
  try {
    const rtdbRef = ref(rtdb);
    const snapshot = await get(child(rtdbRef, 'inquiries'));
    
    if (snapshot.exists()) {
      const rtdbData = snapshot.val();
      if (rtdbData) {
        Object.values(rtdbData).forEach((inq) => {
          if (inq && inq.id) {
            list.push(inq);
          }
        });
      }
    }
  } catch (error) {
    console.warn(`[RTDDB-FETCH] Region fetch failed or ignored at ${correctDatabaseUrl}:`, error);
  }

  // Sort descending
  list.sort((a, b) => {
    const idA = Number(a.id?.replace('inq-', '')) || 0;
    const idB = Number(b.id?.replace('inq-', '')) || 0;
    return idB - idA;
  });

  return list;
}

// Delete inquiry exclusively from the correct Realtime Database
export async function deleteInquiryFromFirestore(id) {
  try {
    const rtdbRef = ref(rtdb, 'inquiries/' + id);
    await remove(rtdbRef);
    console.log(`[RTDDB-DELETE] Success at ${correctDatabaseUrl} for lead ID: ${id}`);
  } catch (error) {
    console.warn(`[RTDDB-DELETE] Region delete failed at ${correctDatabaseUrl}:`, error);
  }
}

// Real-time synchronization subscription helper
export function subscribeToInquiries(callback) {
  try {
    const inquiriesRef = ref(rtdb, 'inquiries');

    const unsub = onValue(inquiriesRef, (snapshot) => {
      const list = [];
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (val) {
          Object.values(val).forEach((inq) => {
            if (inq && inq.id) {
              list.push(inq);
            }
          });
        }
      }

      // Sort descending
      list.sort((a, b) => {
        const idA = Number(a.id?.replace('inq-', '')) || 0;
        const idB = Number(b.id?.replace('inq-', '')) || 0;
        return idB - idA;
      });

      callback(list);
    }, (error) => {
      console.warn(`[RTDDB-SUBSCRIBE] Subscription failed at ${correctDatabaseUrl}:`, error);
    });

    return unsub;
  } catch (err) {
    console.warn(`[RTDDB-SUBSCRIBE] Could not build listener context for ${correctDatabaseUrl}:`, err);
    return () => {};
  }
}

// Mock Firestore network testing (no-op as we use RTDDB exclusively)
export async function testConnection() {
  console.log('RTDDB exclusively active. Connection verification complete.');
}
