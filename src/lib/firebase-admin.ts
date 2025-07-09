import 'server-only';
import admin from 'firebase-admin';

// This configuration is required for server-side actions like creating users
// and managing session cookies.
// Ensure these environment variables are set in your .env file.
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

try {
  if (!admin.apps.length) {
    // Check if the essential config values are provided
    if (firebaseAdminConfig.projectId && firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminConfig),
      });
    } else {
        // This is not an error, but a warning for the developer.
        // The app can run without admin features, but they will fail if called.
        console.warn('Firebase Admin SDK not initialized. Required environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing.');
    }
  }
} catch (error: any) {
  console.error('Firebase Admin SDK initialization error:', error.stack);
}

// A function to check if the admin SDK is usable
function isAdminSdkInitialized() {
  return admin.apps.length > 0;
}

// Proxies to provide helpful errors if the SDK is not initialized
const adminAuthProxy = new Proxy({}, {
  get(_, prop) {
    if (!isAdminSdkInitialized()) {
      throw new Error("Firebase Admin SDK has not been initialized. Please check your server environment variables.");
    }
    return Reflect.get(admin.auth(), prop);
  }
}) as admin.auth.Auth;

const adminDbProxy = new Proxy({}, {
  get(_, prop) {
    if (!isAdminSdkInitialized()) {
      throw new Error("Firebase Admin SDK has not been initialized. Please check your server environment variables.");
    }
    return Reflect.get(admin.firestore(), prop);
  }
}) as admin.firestore.Firestore;

export const adminAuth = adminAuthProxy;
export const adminDb = adminDbProxy;
