import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '../constants';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. 
          The page might have been moved, deleted, or you might have entered the wrong URL.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            to={ROUTES.HOME}
            className="btn btn-primary inline-flex items-center"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}