import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  type UserCredential,
  type User
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDS9BgPflbs3CVpCYE_ZlVcHgw0nOx2T2Y",
  authDomain: "genie-e3e74.firebaseapp.com",
  projectId: "genie-e3e74",
  storageBucket: "genie-e3e74.firebasestorage.app",
  messagingSenderId: "21846163172",
  appId: "1:21846163172:web:7c3a525db1061ff26ff6f1",
  measurementId: "G-MBJ080XJFH"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Initialize Auth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Configure providers
googleProvider.setCustomParameters({ prompt: 'select_account' });
facebookProvider.setCustomParameters({ 'display': 'popup' });

// Auth helpers
export const loginWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const registerWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Send email verification
    await sendEmailVerification(result.user);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createOrUpdateUserProfile(result);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    await createOrUpdateUserProfile(result);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithTwitter = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider);
    await createOrUpdateUserProfile(result);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Helper function to create or update user profile in Firestore
const createOrUpdateUserProfile = async (credential: UserCredential) => {
  const { user } = credential;
  const userDoc = doc(db, 'users', user.uid);

  // Get provider data
  const providerData = user.providerData[0];
  
  await setDoc(userDoc, {
    email: user.email,
    firstName: providerData?.displayName?.split(' ')[0] || '',
    lastName: providerData?.displayName?.split(' ').slice(1).join(' ') || '',
    photoURL: providerData?.photoURL || null,
    userType: 'customer', // Default role for social sign-in
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailVerified: user.emailVerified,
    provider: providerData?.providerId
  }, { merge: true });
};

export const logout = () => {
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user's ID token for backend requests
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}; 