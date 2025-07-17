
import { Routes, Route, Navigate } from 'react-router-dom';
import { ServiceList } from '../../components/provider/ServiceList';
import { ServiceForm } from '../../components/provider/ServiceForm';

export function ProviderDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route index element={<Navigate to="services" replace />} />
        <Route path="services" element={<ServiceList />} />
        <Route path="services/new" element={<ServiceForm />} />
        <Route
          path="services/:id/edit"
          element={<ServiceForm />}
        />
      </Routes>
    </div>
  );
} 