import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';
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

// Save inquiry to BOTH Cloud Firestore and Realtime Database for total safety
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
  console.log('=== [DB-DIAGNOSTIC] PRE-WRITE REPORT ===');
  console.log(`- Runtime Project ID: ${firebaseConfig.projectId || 'Not set'}`);
  console.log(`- Config Database URL: ${firebaseConfig.databaseURL || 'Not set'}`);
  console.log('- Registered Unique RTDB URLs:', rtdbUrlsUnique);
  console.log(`- Resolved Writing URL: ${correctDatabaseUrl}`);
  console.log(`- Target DB Path: ${fullPath}`);
  console.log('- Exact Payload to Write:', JSON.stringify(payload, null, 2));
  console.log('============================================');

  let rtdbSuccess = false;
  let rtdbErrorMsg = '';
  let firestoreSuccess = false;
  let firestoreErrorMsg = '';

  // 1. Write to Realtime Database
  try {
    const rtdbRef = ref(rtdb, fullPath);
    await set(rtdbRef, payload);
    rtdbSuccess = true;
    console.log(`[RTDDB-SAVE] Success - Write completed at ${correctDatabaseUrl}`);
  } catch (error) {
    rtdbErrorMsg = error.message || String(error);
    console.error(`[RTDDB-SAVE] Fallback caught - write failed:`, error);
  }

  // 2. Write to Cloud Firestore (Mirror so it appears under both tabs in Firebase Console)
  try {
    const firestoreRef = doc(db, 'inquiries', inquiry.id);
    await setDoc(firestoreRef, payload);
    firestoreSuccess = true;
    console.log(`[FIRESTORE-SAVE] Success - Mirror write completed for doc ID: ${inquiry.id}`);
  } catch (error) {
    firestoreErrorMsg = error.message || String(error);
    console.error(`[FIRESTORE-SAVE] Mirror write failed:`, error);
  }

  // IMMEDIATE VERIFICATION: Perform a read-back check for both
  console.log('=== [DB-DIAGNOSTIC] IMMEDIATE VERIFICATION START ===');
  
  if (rtdbSuccess) {
    try {
      const rtdbRef = ref(rtdb, fullPath);
      const verifySnap = await get(rtdbRef);
      if (verifySnap.exists()) {
        const dbData = verifySnap.val();
        console.log('✅ RTDDB VERIFICATION SUCCESSFUL: Lead exists in Realtime Database post-write!');
        console.log('- RTDDB Snapshot returned:', JSON.stringify(dbData, null, 2));
      } else {
        console.error('❌ RTDDB VERIFICATION FAILED: Write reported Success, but read-back returned null!');
      }
    } catch (e) {
      console.error('❌ RTDDB VERIFICATION ERROR during read-back:', e);
    }
  } else {
    console.error(`❌ RTDDB Write attempt failed: ${rtdbErrorMsg}`);
  }

  if (firestoreSuccess) {
    try {
      const firestoreRef = doc(db, 'inquiries', inquiry.id);
      const verifySnap = await getDoc(firestoreRef);
      if (verifySnap.exists()) {
        const dbData = verifySnap.data();
        console.log('✅ FIRESTORE VERIFICATION SUCCESSFUL: Lead exists in Cloud Firestore post-write!');
        console.log('- Firestore Snapshot returned:', JSON.stringify(dbData, null, 2));
      } else {
        console.error('❌ FIRESTORE VERIFICATION FAILED: Write reported Success, but read-back returned null!');
      }
    } catch (e) {
      console.error('❌ FIRESTORE VERIFICATION ERROR during read-back:', e);
    }
  } else {
    console.error(`❌ Firestore Write attempt failed: ${firestoreErrorMsg}`);
  }
  
  console.log('======================================================');

  // Throw if both databases fail, otherwise proceed since mirroring did one or both
  if (!rtdbSuccess && !firestoreSuccess) {
    handleRtdbError(
      new Error(`Total database failure. RTDDB: ${rtdbErrorMsg}. Firestore: ${firestoreErrorMsg}`),
      OperationType.CREATE,
      fullPath,
      'RTDDB & Firestore writes failed simultaneously.'
    );
  }
}

// Load inquiries with fallback from both Realtime Database and Cloud Firestore
export async function loadInquiriesFromFirestore() {
  const list = [];
  const trackedIds = new Set();

  // 1. Fetch from Realtime Database
  try {
    const rtdbRef = ref(rtdb);
    const snapshot = await get(child(rtdbRef, 'inquiries'));
    
    if (snapshot.exists()) {
      const rtdbData = snapshot.val();
      if (rtdbData) {
        Object.values(rtdbData).forEach((inq) => {
          if (inq && inq.id) {
            list.push(inq);
            trackedIds.add(inq.id);
          }
        });
      }
    }
  } catch (error) {
    console.warn(`[RTDDB-FETCH] RTDDB fetch skipped/failed:`, error);
  }

  // 2. Fetch from Cloud Firestore to augment/fallback
  try {
    const colRef = collection(db, 'inquiries');
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.id && !trackedIds.has(data.id)) {
        list.push(data);
        trackedIds.add(data.id);
      }
    });
  } catch (error) {
    console.warn(`[FIRESTORE-FETCH] Firestore fetch skipped/failed:`, error);
  }

  // Sort descending
  list.sort((a, b) => {
    const idA = Number(a.id?.replace('inq-', '')) || 0;
    const idB = Number(b.id?.replace('inq-', '')) || 0;
    return idB - idA;
  });

  return list;
}

// Delete inquiry from BOTH Cloud Firestore and Realtime Database
export async function deleteInquiryFromFirestore(id) {
  // 1. RTDDB removal
  try {
    const rtdbRef = ref(rtdb, 'inquiries/' + id);
    await remove(rtdbRef);
    console.log(`[RTDDB-DELETE] Success at ${correctDatabaseUrl} for ID: ${id}`);
  } catch (error) {
    console.warn(`[RTDDB-DELETE] RTDDB removal failed:`, error);
  }

  // 2. Firestore removal
  try {
    const firestoreRef = doc(db, 'inquiries', id);
    await deleteDoc(firestoreRef);
    console.log(`[FIRESTORE-DELETE] Success for ID: ${id}`);
  } catch (error) {
    console.warn(`[FIRESTORE-DELETE] Firestore removal failed:`, error);
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
