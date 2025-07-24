import React from 'react';
import { ProfessionalApprovalDashboard } from '@/components/admin/ProfessionalApprovalDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const AdminProfessionalApproval: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <ProfessionalApprovalDashboard />
    </ProtectedRoute>
  );
};
