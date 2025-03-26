import React from 'react';

function SidebarToggle({ isOpen, onClick }) {
  return (
    <div className="lg:hidden fixed top-0 left-0 p-4 z-20">
      <button 
        onClick={onClick} 
        className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </div>
  );
}

export default SidebarToggle; 