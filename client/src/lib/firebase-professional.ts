import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  UserCredential,
  ActionCodeSettings
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

// Professional Firebase Configuration
const professionalFirebaseConfig = {
  apiKey: import.meta.env.VITE_PROFESSIONAL_FIREBASE_API_KEY || "AIzaSyA7TXggnunbPoSMkxdJJEt_BsFemjv0ssA",
  authDomain: import.meta.env.VITE_PROFESSIONAL_FIREBASE_AUTH_DOMAIN || "genie-pro-4ecbd.firebaseapp.com",
  projectId: import.meta.env.VITE_PROFESSIONAL_FIREBASE_PROJECT_ID || "genie-pro-4ecbd",
  storageBucket: import.meta.env.VITE_PROFESSIONAL_FIREBASE_STORAGE_BUCKET || "genie-pro-4ecbd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_PROFESSIONAL_FIREBASE_MESSAGING_SENDER_ID || "616039965111",
  appId: import.meta.env.VITE_PROFESSIONAL_FIREBASE_APP_ID || "1:616039965111:web:25610378d17b5ae9ea8832"
};

// Initialize Professional Firebase App
const professionalApp: FirebaseApp = initializeApp(professionalFirebaseConfig, 'professional');

// Initialize Professional Firebase Services
export const professionalAuth: Auth = getAuth(professionalApp);
export const professionalDb: Firestore = getFirestore(professionalApp);

// Google Auth Provider for Professionals
const professionalGoogleProvider = new GoogleAuthProvider();
professionalGoogleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Professional User Interface
export interface ProfessionalUser {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    county: string;
    eircode: string;
  };
  citizenship?: string;
  visaType?: string;
  services?: string[];
  ppsn?: string;
  experience?: string;
  
  // Comprehensive questionnaire fields
  qualifications?: string[];
  certifications?: string;
  previousEmployment?: string;
  references?: string;
  aboutMe?: string;
  workingHours?: string[];
  availability?: string;
  transportMode?: string;
  coverageAreas?: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
  additionalInfo?: string;
  
  status: 'pending' | 'approved' | 'rejected';
  emailVerified: boolean;
  awaitingAdminApproval?: boolean;
  needsOnboarding?: boolean;
  createdAt: any;
  updatedAt: any;
}

// Professional Authentication Functions

export const checkProfessionalExists = async (email: string): Promise<ProfessionalUser | null> => {
  try {
    // Query professionals collection by email
    const professionalsRef = collection(professionalDb, 'professionals');
    const q = query(professionalsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { uid: doc.id, ...doc.data() } as ProfessionalUser;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error checking professional existence:', error);
    // Don't block registration if we can't check - allow it to proceed
    console.warn('Professional existence check failed, allowing registration to proceed');
    return null;
  }
};

export const registerProfessionalWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    // First check if professional already exists in database
    const existingProfessional = await checkProfessionalExists(email);
    if (existingProfessional) {
      throw new Error('Professional account already exists. Please sign in instead.');
    }
    
    const userCredential = await createUserWithEmailAndPassword(professionalAuth, email, password);
    
    // Create basic professional profile - questionnaire will complete it
    await createProfessionalProfile(userCredential.user, {
      email,
      status: 'pending',
      emailVerified: false,
      awaitingAdminApproval: true,
      needsOnboarding: true, // Flag to show questionnaire
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return userCredential;
  } catch (error: any) {
    console.error('Professional registration error:', error);
    throw new Error(error.message || 'Failed to register professional account');
  }
};

export const loginProfessionalWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(professionalAuth, email, password);
    
    // Check admin approval status after successful authentication
    await checkProfessionalApprovalStatus(userCredential.user);
    
    return userCredential;
  } catch (error: any) {
    console.error('Professional login error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const signInProfessionalWithGoogle = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(professionalAuth, professionalGoogleProvider);
    
    // Check if professional profile exists, create if not
    const professionalProfile = await getProfessionalProfile(userCredential.user.uid);
    if (!professionalProfile) {
      await createProfessionalProfile(userCredential.user, {
        email: userCredential.user.email || '',
        status: 'pending',
        emailVerified: userCredential.user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Professional Google sign-in error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

export const resetProfessionalPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(professionalAuth, email);
  } catch (error: any) {
    console.error('Professional password reset error:', error);
    throw new Error(error.message || 'Failed to send reset email');
  }
};

export const sendProfessionalEmailVerification = async (user: User): Promise<void> => {
  try {
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/professional/login?verified=true`,
      handleCodeInApp: false
    };
    
    await sendEmailVerification(user, actionCodeSettings);
  } catch (error: any) {
    console.error('Professional email verification error:', error);
    throw new Error(error.message || 'Failed to send verification email');
  }
};

export const checkProfessionalApprovalStatus = async (user: User): Promise<void> => {
  try {
    const professionalRef = doc(professionalDb, 'professionals', user.uid);
    const professionalDoc = await getDoc(professionalRef);
    
    if (!professionalDoc.exists()) {
      await professionalAuth.signOut();
      throw new Error('Professional profile not found. Please complete your onboarding application.');
    }
    
    const professionalData = professionalDoc.data() as ProfessionalUser;
    
    // Check email verification first
    if (!user.emailVerified) {
      await professionalAuth.signOut();
      throw new Error('Please verify your email address before accessing your dashboard. Check your inbox for a verification link.');
    }
    
    // Check admin approval status
    if (professionalData.status === 'pending') {
      await professionalAuth.signOut();
      throw new Error('Your application is currently under review by our admin team. You will receive an email notification once your application has been processed. Please check back later.');
    }
    
    if (professionalData.status === 'rejected') {
      await professionalAuth.signOut();
      throw new Error('Your application has failed validation and has been rejected. You cannot create an account at this time. Please contact our support team at genietest12345@gmail.com for assistance.');
    }
    
    if (professionalData.status !== 'approved') {
      await professionalAuth.signOut();
      throw new Error('Your account status is invalid. Please contact our support team at genietest12345@gmail.com.');
    }
    
    // Professional is approved and verified - allow access
    console.log('Professional approved and verified - dashboard access granted');
  } catch (error: any) {
    console.error('Professional approval check error:', error);
    throw error;
  }
};

export const requireProfessionalEmailVerification = async (user: User): Promise<void> => {
  if (!user.emailVerified) {
    await professionalAuth.signOut();
    throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.');
  }
};

// Professional Firestore Functions

export const createProfessionalProfile = async (
  user: User, 
  additionalData: Partial<ProfessionalUser>
): Promise<void> => {
  try {
    const professionalRef = doc(professionalDb, 'professionals', user.uid);
    const professionalData: Partial<ProfessionalUser> = {
      uid: user.uid,
      email: user.email || '',
      emailVerified: user.emailVerified,
      ...additionalData,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(professionalRef, professionalData, { merge: true });
  } catch (error: any) {
    console.error('Create professional profile error:', error);
    throw new Error('Failed to create professional profile');
  }
};

export const getProfessionalProfile = async (uid: string): Promise<ProfessionalUser | null> => {
  try {
    const professionalRef = doc(professionalDb, 'professionals', uid);
    const professionalSnap = await getDoc(professionalRef);
    
    if (professionalSnap.exists()) {
      return professionalSnap.data() as ProfessionalUser;
    }
    return null;
  } catch (error: any) {
    console.error('Get professional profile error:', error);
    return null;
  }
};

export const updateProfessionalProfile = async (
  uid: string, 
  data: Partial<ProfessionalUser>
): Promise<void> => {
  try {
    const professionalRef = doc(professionalDb, 'professionals', uid);
    await setDoc(professionalRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error: any) {
    console.error('Update professional profile error:', error);
    throw new Error('Failed to update professional profile');
  }
};

export const submitProfessionalApplication = async (
  uid: string, 
  applicationData: any
): Promise<void> => {
  try {
    // Save to professional profile
    await updateProfessionalProfile(uid, {
      ...applicationData,
      status: 'pending'
    });
    
    // Also save to applications collection for admin review
    const applicationsRef = collection(professionalDb, 'applications');
    await addDoc(applicationsRef, {
      professionalId: uid,
      ...applicationData,
      status: 'pending',
      submittedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Submit professional application error:', error);
    throw new Error('Failed to submit application');
  }
};

// Professional Auth State Management
export const getCurrentProfessional = (): User | null => {
  return professionalAuth.currentUser;
};

export const signOutProfessional = async (): Promise<void> => {
  try {
    await professionalAuth.signOut();
  } catch (error: any) {
    console.error('Professional sign out error:', error);
    throw new Error('Failed to sign out');
  }
};

// Export the professional auth instance for use in contexts
export default professionalAuth;
