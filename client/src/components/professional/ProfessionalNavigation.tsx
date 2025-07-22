
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Search, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  DollarSign
} from 'lucide-react';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';
import { signOutProfessional } from '@/lib/firebase-professional';

export function ProfessionalNavigation() {
  const { user, professionalProfile } = useProfessionalAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutProfessional();
      navigate('/professional/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/professional/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Genie Pro</span>
            </Link>
          </div>

          {/* Professional Navigation Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/professional/dashboard" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Jobs
              </Link>
              
              <Link 
                to="/professional/my-bids" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                My Bids
              </Link>
              
              <Link 
                to="/professional/active-jobs" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Active Jobs
              </Link>
              
              <Link 
                to="/professional/profile" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Profile
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {professionalProfile?.firstName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {professionalProfile?.status === 'approved' ? 'Verified Pro' : 'Pending Approval'}
                  </p>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/professional/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/professional/register">
                  <Button size="sm">Join as Pro</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu (simplified for now) */}
      {user && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/professional/dashboard" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
            >
              Browse Jobs
            </Link>
            <Link 
              to="/professional/my-bids" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
            >
              My Bids
            </Link>
            <Link 
              to="/professional/active-jobs" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
            >
              Active Jobs
            </Link>
            <Link 
              to="/professional/profile" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
