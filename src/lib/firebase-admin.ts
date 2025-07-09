import 'server-only';
import admin from 'firebase-admin';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

function initializeFirebaseAdmin() {
  // Only initialize if it hasn't been already
  if (admin.apps.length > 0) {
    return;
  }

  const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
  if (!serviceAccountString) {
    throw new Error('A variável de ambiente FIREBASE_ADMIN_SDK_CONFIG não está definida.');
  }
  const serviceAccount = JSON.parse(serviceAccountString);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// A proxy to lazily initialize Firebase and get the auth service
const adminAuthProxy = new Proxy<Auth>({} as Auth, {
  get(target, prop) {
    try {
      initializeFirebaseAdmin();
      // Ensure we are getting the property from the initialized auth service
      return Reflect.get(admin.auth(), prop);
    } catch (e: any) {
      console.warn(
        "Firebase Admin SDK não inicializado. A autenticação não funcionará. " +
        `Erro: ${e.message}`
      );
      // Fallback to a mock object on error
      const mockAuth = {
          createUser: () => Promise.reject(new Error('Firebase Admin não está inicializado')),
          createSessionCookie: () => Promise.reject(new Error('Firebase Admin não está inicializado')),
          verifySessionCookie: () => Promise.reject(new Error('Firebase Admin não está inicializado')),
          generatePasswordResetLink: () => Promise.reject(new Error('Firebase Admin não está inicializado')),
      };
      // @ts-ignore
      return Reflect.get(mockAuth, prop);
    }
  },
});

// A proxy for Firestore
const adminDbProxy = new Proxy<Firestore>({} as Firestore, {
  get(target, prop) {
     try {
      initializeFirebaseAdmin();
      return Reflect.get(admin.firestore(), prop);
    } catch (e: any) {
      console.warn(
        "Firebase Admin SDK não inicializado. O Firestore não funcionará. " +
        `Erro: ${e.message}`
      );
      return Reflect.get({} as Firestore, prop); // Return a dummy object
    }
  }
});

export const adminAuth = adminAuthProxy;
export const adminDb = adminDbProxy;
