import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

function DashboardLayout({ user, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simply toggle sidebar with direct boolean value
  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation for mobile */}
        <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm z-20">
          <div className="px-4 h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-gray-900 dark:text-white font-medium">ISGI App</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-sm border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} ISGI App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout; 