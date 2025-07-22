import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  professionalAuth, 
  getProfessionalProfile, 
  ProfessionalUser 
} from '@/lib/firebase-professional';

interface ProfessionalAuthContextType {
  user: User | null;
  professionalProfile: ProfessionalUser | null;
  emailVerified: boolean;
  loading: boolean;
  userRole: 'professional' | null;
}

const ProfessionalAuthContext = createContext<ProfessionalAuthContextType>({
  user: null,
  professionalProfile: null,
  emailVerified: false,
  loading: true,
  userRole: null
});

export const useProfessionalAuth = () => {
  const context = useContext(ProfessionalAuthContext);
  if (!context) {
    throw new Error('useProfessionalAuth must be used within a ProfessionalAuthProvider');
  }
  return context;
};

interface ProfessionalAuthProviderProps {
  children: React.ReactNode;
}

export const ProfessionalAuthProvider: React.FC<ProfessionalAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [professionalProfile, setProfessionalProfile] = useState<ProfessionalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(professionalAuth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Fetch professional profile from Firestore
          const profile = await getProfessionalProfile(user.uid);
          setProfessionalProfile(profile);
        } catch (error) {
          console.error('Error fetching professional profile:', error);
          setProfessionalProfile(null);
        }
      } else {
        setProfessionalProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: ProfessionalAuthContextType = {
    user,
    professionalProfile,
    emailVerified: user?.emailVerified || false,
    loading,
    userRole: user ? 'professional' : null
  };

  return (
    <ProfessionalAuthContext.Provider value={value}>
      {children}
    </ProfessionalAuthContext.Provider>
  );
};
