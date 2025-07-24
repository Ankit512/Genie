import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth, onAuthChange, signOut, getUserRole } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userRole: 'customer' | 'provider' | 'admin' | null;
  loading: boolean;
  emailVerified: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  emailVerified: false,
  loading: true
});

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'provider' | 'admin' | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        try {
          // Always refresh user data to get latest email verification status
          await user.reload();
          
          // Check if email is verified
          if (user.emailVerified) {
            // Email is verified - user can access the app
            setUser(user);
            setEmailVerified(true);
            
            // Get user role including admin check
            const role = await getUserRole(user);
            setUserRole(role);
          } else {
            // Email is NOT verified - treat as unauthenticated
            console.log('User email not verified, signing out...');
            setUser(null);
            setEmailVerified(false);
            setUserRole(null);
            
            // Sign out the user to prevent access to the app
            await signOut(auth);
          }
        } catch (error) {
          console.error('Error checking user verification:', error);
          setUser(null);
          setEmailVerified(false);
          setUserRole(null);
        }
      } else {
        // No user signed in
        setUser(null);
        setUserRole(null);
        setEmailVerified(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userRole,
    emailVerified,
    loading
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 