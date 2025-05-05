
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-10">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-primary dark:text-white">
            Event Horizon
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-gray-300">
                Welcome, {user?.username}
              </span>
              
              {isAdmin && (
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  Admin Panel
                </Button>
              )}
              
              <Button variant="outline" onClick={() => navigate('/my-bookings')}>
                My Bookings
              </Button>
              
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              
              <Button onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
