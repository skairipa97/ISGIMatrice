import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Avatar from './ui/Avatar';

function Sidebar({ user, onLogout, isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleCloseClick = () => onClose();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const getNavigationItems = () => {
    const commonItems = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      },
      {
        name: "Profile",
        path: "/profile",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      },
      {
        name: "Settings",
        path: "/settings",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      }
    ];

    const roleSpecificItems = {
      stagiaire: [],
      formateur: [
        {
          name: "Groupes",
          path: "/groupes",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        }
      ],
      admin: [
        {
          name: "Absence",
          path: "/absences",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        },
        {
          name: "Justification",
          path: "/justification",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        }
      ]
    };

    switch(user?.role) {
      case 'formateur':
        return [...commonItems, ...roleSpecificItems.formateur];
      case 'admin':
        return [...commonItems, ...roleSpecificItems.admin];
      case 'stagiaire':
      default:
        return commonItems;
    }
  };

  const getSupportItems = () => {
    const commonSupportItems = [];
    if (user?.role === 'stagiaire') {
      commonSupportItems.push({
        name: "Justification",
        path: "/stagiaire/absences-justification",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      });
    }
    return commonSupportItems;
  };

  const menuItems = getNavigationItems();
  const supportItems = getSupportItems();

  return (
    <>
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out overflow-hidden`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <span className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">ISGI App</span>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button type="button" onClick={handleCloseClick} className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Close sidebar">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar name={`${user?.nom} ${user?.prenom}`} size="md" status="online" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.nom}&nbsp;{user?.prenom}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.role && (<span className="capitalize">{user.role}</span>)}
                  {user?.matricule && (<span> • Matricule: {user?.matricule}</span>)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow p-4 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 mb-4">Navigation</p>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path} className={`group flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${isActive(item.path) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={handleLinkClick}>
                  <span className={`mr-3 ${isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                  {isActive(item.path) && (<span className="ml-auto h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>)}
                </Link>
              ))}
            </nav>

            {supportItems.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 mt-8 mb-4">Support</p>
                <nav className="space-y-1">
                  {supportItems.map((item) => (
                    <Link key={item.path} to={item.path} className="group flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" onClick={handleLinkClick}>
                      <span className="mr-3">{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onLogout} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-opacity-25 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200" onClick={onClose} aria-hidden="true"></div>
      )}
    </>
  );
}

export default Sidebar;