import 'server-only';
import admin from 'firebase-admin';

// Check if the app is already initialized
if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey,
                }),
            });
            console.log("Firebase Admin SDK initialized successfully.");
        } catch (error: any) {
             console.error("Firebase Admin SDK initialization error:", error.message);
        }
    } else {
        console.warn("Firebase Admin SDK credentials are not fully set in .env file. Some server-side Firebase services will be unavailable.");
    }
}

// Create a proxy to handle cases where the SDK is not initialized
const adminAuthProxy = new Proxy(
  {},
  {
    get(_target, prop) {
      if (!admin.apps.length) {
        // This error will be caught by server actions, providing clear feedback to the user.
        throw new Error(
          'Firebase Admin SDK has not been initialized. Please check your server environment variables.'
        );
      }
      return Reflect.get(admin.auth(), prop);
    },
  }
) as admin.auth.Auth;

const adminDbProxy = new Proxy(
  {},
  {
    get(_target, prop) {
      if (!admin.apps.length) {
        throw new Error(
          'Firebase Admin SDK has not been initialized. Please check your server environment variables.'
        );
      }
      return Reflect.get(admin.firestore(), prop);
    },
  }
) as admin.firestore.Firestore;

export const adminAuth = adminAuthProxy;
export const adminDb = adminDbProxy;
