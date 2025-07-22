import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfessionalAuthProvider } from './contexts/ProfessionalAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navigation } from './components/shared/Navigation';
import { ProfessionalNavigation } from './components/professional/ProfessionalNavigation';
import { LiveChatWidget } from './components/shared/LiveChatWidget';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { EmailVerificationHandler } from './components/auth/EmailVerificationHandler';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { ServiceListPage } from './pages/customer/ServiceListPage';
import { ServiceDetailPage } from './pages/customer/ServiceDetailPage';
import { AdminTestPage } from './pages/AdminTestPage';
import { ProfilePage } from './pages/ProfilePage';
import { BookingHistoryPage } from './pages/BookingHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfessionalOnboarding } from './pages/ProfessionalOnboarding';

import { ProfessionalLogin } from './pages/ProfessionalLogin';
import { ProfessionalRegister } from './pages/ProfessionalRegister';
import { ProfessionalHero } from './pages/ProfessionalHero';
import { EnhancedProfessionalDashboard } from './components/professional/EnhancedProfessionalDashboard';
import { useAuth } from './hooks/useAuth';

import { AdminProfessionalApproval } from './pages/AdminProfessionalApproval';

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
      <Route path="/verify-email" element={<EmailVerificationHandler />} />
      <Route path="/services" element={<ServiceListPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/admin-test" element={<AdminTestPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/booking-history" element={<BookingHistoryPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      
      {/* Professional Routes */}
      <Route path="/professional" element={<ProfessionalHero />} />
      <Route path="/professional/login" element={<ProfessionalLogin />} />
      <Route path="/professional/register" element={<ProfessionalRegister />} />
      <Route path="/professional/onboarding" element={<ProfessionalOnboarding />} />
      <Route path="/professional/dashboard" element={
        <div>
          <ProfessionalNavigation />
          <EnhancedProfessionalDashboard />
        </div>
      } />
      <Route path="/professional/my-bids" element={
        <div>
          <ProfessionalNavigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bids</h1>
            <p className="text-gray-600">Your active and past bids will appear here.</p>
          </div>
        </div>
      } />
      <Route path="/professional/active-jobs" element={
        <div>
          <ProfessionalNavigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Active Jobs</h1>
            <p className="text-gray-600">Your ongoing projects will appear here.</p>
          </div>
        </div>
      } />
      <Route path="/professional/profile" element={
        <div>
          <ProfessionalNavigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Professional Profile</h1>
            <p className="text-gray-600">Manage your professional profile and settings.</p>
          </div>
        </div>
      } />
      
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
      
      {/* Admin Routes */}
      <Route path="/admin/professional-approval" element={<AdminProfessionalApproval />} />
      
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

function AppContent() {
  const location = useLocation();
  
  // Determine if we're in professional portal
  const isProfessionalPortal = location.pathname.startsWith('/professional');
  
  // Pages where chatbot should be hidden
  const hideChatbotPages = ['/login', '/register', '/verify-email', '/professional/login', '/professional/register'];
  const shouldHideChatbot = hideChatbotPages.includes(location.pathname) || isProfessionalPortal;

  if (isProfessionalPortal) {
    // Professional portal with separate auth context and navigation
    return (
      <ProfessionalAuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </ProfessionalAuthProvider>
    );
  }

  // Customer portal with original auth context and navigation
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <AppRoutes />
        </main>
        {!shouldHideChatbot && <LiveChatWidget />}
      </div>
    </AuthProvider>
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
      <Router basename={import.meta.env.PROD ? '/Genie/' : ''}>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
