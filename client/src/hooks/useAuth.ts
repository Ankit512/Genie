import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthState {
  user: User | null;
  userRole: 'customer' | 'provider' | null;
  emailVerified: boolean;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userRole: null,
    emailVerified: false,
    loading: true
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Refresh user data to get latest email verification status
          await user.reload();
          
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userRole = userDoc.data()?.userType || null;
          
          setAuthState({
            user,
            userRole,
            emailVerified: user.emailVerified,
            loading: false
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAuthState({
            user,
            userRole: null,
            emailVerified: false,
            loading: false
          });
        }
      } else {
        setAuthState({
          user: null,
          userRole: null,
          emailVerified: false,
          loading: false
        });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return authState;
} 