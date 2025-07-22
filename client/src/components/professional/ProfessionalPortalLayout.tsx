import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProfessionalNavigation } from './ProfessionalNavigation';

interface ProfessionalPortalLayoutProps {
  children: React.ReactNode;
}

export function ProfessionalPortalLayout({ children }: ProfessionalPortalLayoutProps) {
  const location = useLocation();
  
  // Don't show navigation on auth pages
  const isAuthPage = ['/professional/login', '/professional/register'].includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <ProfessionalNavigation />}
      <main>
        {children}
      </main>
    </div>
  );
}
