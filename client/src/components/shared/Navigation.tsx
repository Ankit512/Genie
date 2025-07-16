import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { logout } from '../../lib/firebase';

export function Navigation() {
  const { user, userRole } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Genie</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                {userRole === 'customer' && (
                  <>
                    <Link
                      to="/customer/services"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    >
                      Find Services
                    </Link>
                    <Link
                      to="/customer/bookings"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    >
                      My Bookings
                    </Link>
                  </>
                )}

                {userRole === 'provider' && (
                  <>
                    <Link
                      to="/provider/services"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    >
                      My Services
                    </Link>
                    <Link
                      to="/provider/bookings"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    >
                      Bookings
                    </Link>
                  </>
                )}

                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                {userRole === 'customer' && (
                  <>
                    <Link
                      to="/customer/services"
                      className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Find Services
                    </Link>
                    <Link
                      to="/customer/bookings"
                      className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                  </>
                )}

                {userRole === 'provider' && (
                  <>
                    <Link
                      to="/provider/services"
                      className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Services
                    </Link>
                    <Link
                      to="/provider/bookings"
                      className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Bookings
                    </Link>
                  </>
                )}

                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 