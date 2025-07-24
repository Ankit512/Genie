import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, getUserRole } from '../lib/firebase';

interface AuthState {
  user: User | null;
  userRole: 'customer' | 'provider' | 'admin' | null;
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
          
          // Get user role including admin check
          const userRole = await getUserRole(user);
          
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