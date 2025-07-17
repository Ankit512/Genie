import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthState {
  user: User | null;
  userRole: 'customer' | 'provider' | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userRole: null,
    loading: true
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userRole = userDoc.data()?.userType || null;
          
          setAuthState({
            user,
            userRole,
            loading: false
          });
        } catch (error) {
          console.error('Error fetching user role:', error);
          setAuthState({
            user,
            userRole: null,
            loading: false
          });
        }
      } else {
        setAuthState({
          user: null,
          userRole: null,
          loading: false
        });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return authState;
} 