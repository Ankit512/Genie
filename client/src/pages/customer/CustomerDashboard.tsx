
import { Routes, Route, Navigate } from 'react-router-dom';
import { ServiceListPage } from './ServiceListPage';
import { ServiceDetailPage } from './ServiceDetailPage';

export function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route index element={<Navigate to="services" replace />} />
          <Route path="services" element={<ServiceListPage />} />
          <Route path="services/:id" element={<ServiceDetailPage />} />
          {/* Add more customer routes here (e.g., bookings, reviews) */}
        </Routes>
      </div>
    </div>
  );
} 