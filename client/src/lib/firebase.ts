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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDS9BgPflbs3CVpCYE_ZlVcHgw0nOx2T2Y",
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

// Configure providers for development and production
googleProvider.setCustomParameters({ 
  prompt: 'select_account',
  // Allow localhost for development
  redirect_uri: window.location.origin
});
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
    // Send email verification with continue URL to redirect back to our app
    const actionCodeSettings = {
      url: `${window.location.origin}/login?verified=true`,
      handleCodeInApp: false,
    };
    await sendEmailVerification(result.user, actionCodeSettings);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Secure registration function that handles rollback on failure
export const registerWithEmailSecure = async (email: string, password: string, userData: any): Promise<UserCredential> => {
  let userCredential: UserCredential | null = null;
  
  try {
    // Step 1: Create Firebase user
    userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Step 2: Send email verification with continue URL to redirect back to our app
    const actionCodeSettings = {
      url: `${window.location.origin}/login?verified=true`,
      handleCodeInApp: false,
    };
    await sendEmailVerification(userCredential.user, actionCodeSettings);
    
    // Step 3: Create user profile in Firestore
    const userDoc = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDoc, {
      ...userData,
      email: userCredential.user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: false
    });
    
    return userCredential;
  } catch (error: any) {
    // Rollback: Delete the Firebase user if profile creation failed
    if (userCredential?.user) {
      try {
        await userCredential.user.delete();
        console.log('Rolled back user creation due to error:', error.message);
      } catch (deleteError) {
        console.error('Failed to rollback user creation:', deleteError);
      }
    }
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createOrUpdateUserProfile(result);
    return result.user;
  } catch (error: any) {
    // Handle specific Google OAuth errors
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Google sign-in. Please contact support.');
    }
    throw new Error(error.message || 'Failed to sign in with Google');
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
    // Send email verification with continue URL to redirect back to our app
    const actionCodeSettings = {
      url: `${window.location.origin}/login?verified=true`,
      handleCodeInApp: false,
    };
    await sendEmailVerification(user, actionCodeSettings);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email: string) => {
  try {
    // Configure password reset to redirect to our custom handler
    const actionCodeSettings = {
      url: `${window.location.origin}/password-reset`,
      handleCodeInApp: false,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Export signOut function
export { signOut } from 'firebase/auth';

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

// Check if user's email is verified
export const checkEmailVerification = async (user: User): Promise<boolean> => {
  await user.reload();
  return user.emailVerified;
};

// Enforce email verification before allowing access
export const requireEmailVerification = async (user: User): Promise<void> => {
  if (!user.emailVerified) {
    await user.reload(); // Refresh user data
    if (!user.emailVerified) {
      throw new Error('Please verify your email before accessing the application.');
    }
  }
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