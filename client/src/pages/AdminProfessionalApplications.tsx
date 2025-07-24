import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfessionalApplicationsDashboard } from '@/components/admin/ProfessionalApplicationsDashboard';

export const AdminProfessionalApplications: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <ProfessionalApplicationsDashboard />
    </ProtectedRoute>
  );
}; 