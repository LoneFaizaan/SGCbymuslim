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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
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

// Save inquiry to Firestore database
export async function saveInquiryToFirestore(inquiry) {
  const path = `inquiries/${inquiry.id}`;
  try {
    // Avoid storing optional undefined fields
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
    await setDoc(doc(db, 'inquiries', inquiry.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Load inquiries from Firestore database
export async function loadInquiriesFromFirestore() {
  const path = 'inquiries';
  try {
    const snapshot = await getDocs(collection(db, path));
    const inquiries = [];
    snapshot.forEach((docSnapshot) => {
      inquiries.push(docSnapshot.data());
    });
    return inquiries;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Delete inquiry from Firestore database
export async function deleteInquiryFromFirestore(id) {
  const path = `inquiries/${id}`;
  try {
    await deleteDoc(doc(db, 'inquiries', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
