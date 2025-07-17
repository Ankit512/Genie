
import { Routes, Route, Navigate } from 'react-router-dom';
import { ServiceListPage } from './ServiceListPage';
import { ServiceDetailPage } from './ServiceDetailPage';

export function CustomerDashboard() {
  return (
    <Routes>
      <Route index element={<Navigate to="services" replace />} />
      <Route path="services" element={<ServiceListPage />} />
      <Route path="services/:id" element={<ServiceDetailPage />} />
      {/* Add more customer routes here (e.g., bookings, reviews) */}
    </Routes>
  );
} 