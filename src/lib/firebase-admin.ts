import admin from 'firebase-admin';

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

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };
