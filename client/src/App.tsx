import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/shared/Navigation';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { ServiceListPage } from './pages/customer/ServiceListPage';
import { ServiceDetailPage } from './pages/customer/ServiceDetailPage';
import { useAuth } from './hooks/useAuth';

function AppRoutes() {
  const { user, userRole, loading } = useAuth();

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
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/services" element={<ServiceListPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      
      {/* Customer Routes */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute requiredRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Provider Routes */}
      <Route
        path="/provider/*"
        element={
          <ProtectedRoute requiredRole="provider">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect based on role */}
      <Route
        path="/dashboard"
        element={
          user ? (
            userRole === 'provider' ? (
              <Navigate to="/provider" replace />
            ) : (
              <Navigate to="/customer" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
