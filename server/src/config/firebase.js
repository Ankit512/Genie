import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin with service account
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

export const auth = admin.auth();
export const db = admin.firestore();

// Helper functions for common Firebase operations
export const verifyToken = async (token) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const getUserByUid = async (uid) => {
  try {
    const userRecord = await auth.getUser(uid);
    const userDoc = await db.collection('users').doc(uid).get();
    return {
      ...userRecord.toJSON(),
      ...userDoc.data()
    };
  } catch (error) {
    throw new Error('User not found');
  }
};

export const createUser = async (userData) => {
  try {
    const { email, password, role, name, phone, address } = userData;
    
    // Create auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Create user document
    await db.collection('users').doc(userRecord.uid).set({
      email,
      role,
      name,
      phone,
      address,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      consentedGDPR: userData.consentedGDPR || false,
      status: role === 'provider' ? 'pending' : 'active'
    });

    return userRecord;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}; 