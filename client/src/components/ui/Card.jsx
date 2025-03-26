import React from 'react';

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className = '' }) {
  return (
    <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
}

function CardContent({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription }; 