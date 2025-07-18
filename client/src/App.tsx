import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/shared/Navigation';
import { LiveChatWidget } from './components/shared/LiveChatWidget';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { ServiceListPage } from './pages/customer/ServiceListPage';
import { ServiceDetailPage } from './pages/customer/ServiceDetailPage';
import { AdminTestPage } from './pages/AdminTestPage';
import { useAuth } from './hooks/useAuth';

function AppRoutes() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/services" element={<ServiceListPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/admin-test" element={<AdminTestPage />} />
      
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
  // Clear any existing theme preference to ensure light mode on load
  useEffect(() => {
    if (!localStorage.getItem('genie-ui-theme')) {
      localStorage.setItem('genie-ui-theme', 'light');
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="genie-ui-theme">
      <Router basename={import.meta.env.PROD ? '/Genie' : ''}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <AppRoutes />
            </main>
            <LiveChatWidget />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
