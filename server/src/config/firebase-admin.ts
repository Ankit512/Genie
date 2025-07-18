import admin from 'firebase-admin';
import 'dotenv/config';
import { readFileSync } from 'fs';

// Service account credentials are supplied via the FIREBASE_ADMIN_SA environment
// variable as a JSON string or via GOOGLE_APPLICATION_CREDENTIALS pointing to a
// JSON file path. This prevents committing secrets to the repository.

let credential: admin.credential.Credential;

if (process.env.FIREBASE_ADMIN_SA) {
  credential = admin.credential.cert(
    JSON.parse(process.env.FIREBASE_ADMIN_SA)
  );
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const serviceAccount = JSON.parse(
    readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')
  );
  credential = admin.credential.cert(serviceAccount);
} else {
  throw new Error(
    'Firebase admin credentials not provided. Set FIREBASE_ADMIN_SA or GOOGLE_APPLICATION_CREDENTIALS.'
  );
}

// Initialize Firebase Admin
admin.initializeApp({
  credential,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined
});

// Export Firebase Admin services
export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();

// Helper functions for auth
export const verifyToken = async (token: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const getUserByUid = async (uid: string) => {
  try {
    const [userRecord, userDoc] = await Promise.all([
      auth.getUser(uid),
      db.collection('users').doc(uid).get()
    ]);
    
    return {
      ...userRecord.toJSON(),
      ...userDoc.data()
    };
  } catch (error) {
    throw new Error('User not found');
  }
};

// Helper functions for Firestore
export const createUser = async (userData: {
  uid: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  name?: string;
  phone?: string;
  address?: string;
}) => {
  const { uid, ...data } = userData;
  await db.collection('users').doc(uid).set({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
};

// Collection references
export const collections = {
  users: db.collection('users'),
  providers: db.collection('providers'),
  bookings: db.collection('bookings'),
  reviews: db.collection('reviews'),
  services: db.collection('services')
}; 