// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-9xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</p>
      <p className="text-lg text-gray-500 mb-8 max-w-lg">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;