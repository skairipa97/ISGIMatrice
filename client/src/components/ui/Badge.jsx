import React from 'react';

const variants = {
  primary: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  light: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300',
  dark: 'bg-gray-700 text-gray-200 dark:bg-gray-900 dark:text-gray-100',
};

const sizes = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm',
};

const shapes = {
  square: 'rounded-sm',
  rounded: 'rounded',
  pill: 'rounded-full',
};

function Badge({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  className = '',
  outline = false,
  icon,
  iconPosition = 'left',
  removeButton = false,
  onRemove,
  ...rest
}) {
  // Apply base classes, variant, size and shape
  const baseClass = 'inline-flex items-center font-medium';
  const variantClass = outline 
    ? `bg-transparent border border-${variant.split('-')[0]}-500 text-${variant.split('-')[0]}-500 dark:text-${variant.split('-')[0]}-400` 
    : variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  const shapeClass = shapes[shape] || shapes.rounded;
  
  return (
    <span 
      className={`${baseClass} ${variantClass} ${sizeClass} ${shapeClass} ${className}`}
      {...rest}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-1.5 -ml-0.5">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-1.5 -mr-0.5">{icon}</span>
      )}
      
      {removeButton && (
        <button 
          type="button" 
          className="flex-shrink-0 ml-1.5 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
          onClick={onRemove}
        >
          <span className="sr-only">Remove badge</span>
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
}

export default Badge; 