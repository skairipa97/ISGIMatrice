import React from 'react';

function Avatar({ name, size = 'md', status }) {
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };

  // Status indicator classes and position
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  return (
    <div className="relative inline-flex">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium`}
      >
        {getInitials(name)}
      </div>
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 ${statusClasses[status]}`}
        />
      )}
    </div>
  );
}

export default Avatar; 