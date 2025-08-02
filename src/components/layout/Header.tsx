import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { ROUTES, APP_NAME } from '../../constants';

export function Header() {
  const navigate = useNavigate();

  // Mock user data - replace with actual auth context
  const user = null; // Will be replaced with actual user from auth context
  const isAuthenticated = false; // Will be replaced with actual auth state

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`${ROUTES.UNIVERSITIES}?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                {APP_NAME}
              </span>
            </Link>
            
            <nav className="hidden md:flex ml-8 space-x-8">
              <Link
                to={ROUTES.UNIVERSITIES}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Universities
              </Link>
              <Link
                to={ROUTES.PROGRAMS}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Programs
              </Link>
              <Link
                to={ROUTES.SCHOLARSHIPS}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Scholarships
              </Link>
              {isAuthenticated && (
                <Link
                  to={ROUTES.APPLICATIONS}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Applications
                </Link>
              )}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  name="search"
                  placeholder="Search universities, programs..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  type="button"
                  className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
                >
                  <BellIcon className="h-6 w-6" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {user?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </button>
                  {/* User dropdown menu would go here */}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}