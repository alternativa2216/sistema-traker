import admin from 'firebase-admin';

let adminAuth: admin.auth.Auth;
let adminDb: admin.firestore.Firestore;

try {
  const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;

  if (!serviceAccountString) {
    throw new Error('A variável de ambiente FIREBASE_ADMIN_SDK_CONFIG não está definida.');
  }

  // Parse a stringified service account key
  const serviceAccount = JSON.parse(serviceAccountString);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  adminAuth = admin.auth();
  adminDb = admin.firestore();

} catch (error: any) {
    console.warn(
    "Firebase Admin SDK não inicializado. A autenticação e as funções de admin não funcionarão. " +
    "Verifique se a variável de ambiente FIREBASE_ADMIN_SDK_CONFIG está definida corretamente. " +
    `Erro: ${error.message}`
  );
  
  // Provide a mock implementation to prevent crashes on import
  // This allows the app to run, but auth-related server actions will fail gracefully.
  const mockAuth = {
    createUser: () => Promise.reject(new Error('Firebase Admin não está inicializado')),
    createSessionCookie: () => Promise.reject(new Error('Firebase Admin não está inicializado')),
    verifySessionCookie: () => Promise.reject(new Error('Firebase Admin não está inicializado')),
    generatePasswordResetLink: () => Promise.reject(new Error('Firebase Admin não está inicializado')),
    // Add any other functions you might call
  };

  // @ts-ignore
  adminAuth = mockAuth;
  // @ts-ignore
  adminDb = {}; // Mock Firestore if needed
}

export { adminAuth, adminDb };
