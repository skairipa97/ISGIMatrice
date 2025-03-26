import React from 'react';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  info: 'bg-blue-500 hover:bg-blue-600 text-white',
  light: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200',
  dark: 'bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-900 dark:hover:bg-gray-800',
  link: 'bg-transparent text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline',
  outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-white',
};

const sizes = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
  xl: 'text-lg px-6 py-3',
};

function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  iconLeft,
  iconRight,
  isLoading = false,
  loadingText = 'Loading...',
  onClick,
  ...rest
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const disabledClasses = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : (
        <>
          {iconLeft && <span className="mr-2">{iconLeft}</span>}
          {children}
          {iconRight && <span className="ml-2">{iconRight}</span>}
        </>
      )}
    </button>
  );
}

export default Button; 