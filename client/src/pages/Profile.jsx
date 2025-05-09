import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import axios from 'axios';

function Profile({ user, onLogout, updateUserProfile }) {
  // Initialize state with user data or empty strings
  const [firstName, setFirstName] = useState(user?.prenom || '');
  const [lastName, setLastName] = useState(user?.nom || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.prenom || '');
      setLastName(user.nom || '');
    }
  }, [user]);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePasswordChange = (e, field) => {
    const value = e.target.value;
    switch (field) {
      case 'current':
        setCurrentPassword(value);
        break;
      case 'new':
        setNewPassword(value);
        break;
      case 'confirm':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      setMessage({ text: 'First name and last name are required', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        onLogout();
        return;
      }
      
      const response = await axios.put('http://localhost:8000/api/user/profile', 
        { prenom: prenom, nom: nom },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Update the user data in the parent component with the new first_name and last_name
      updateUserProfile({ prenom: prenom, nom: nom });
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ 
        text: error.response?.data?.message || error.response?.data?.errors?.first_name?.[0] || error.response?.data?.errors?.last_name?.[0] || 'Failed to update profile', 
        type: 'error' 
      });
      
      // If unauthorized, log out
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (!currentPassword) {
      setPasswordMessage({ text: 'Current password is required', type: 'error' });
      return;
    }

    if (!newPassword) {
      setPasswordMessage({ text: 'New password is required', type: 'error' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ text: 'Password must be at least 8 characters long', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    setIsPasswordLoading(true);
    setPasswordMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        onLogout();
        return;
      }

      await axios.put(
        'http://localhost:8000/api/user/password',
        {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setPasswordMessage({ text: 'Password updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Password update error:', error);
      setPasswordMessage({
        text: error.response?.data?.message || 
              error.response?.data?.errors?.current_password?.[0] || 
              error.response?.data?.errors?.password?.[0] || 
              'Failed to update password',
        type: 'error'
      });

      // If unauthorized, log out
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // For the avatar, use the first letter of the first name
  const avatarLetter = firstName ? firstName.charAt(0).toUpperCase() : '?';

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
      </header>
      
      <main className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/3 mb-6 sm:mb-0 sm:pr-8">
                <div className="bg-indigo-100 dark:bg-indigo-900 h-40 w-40 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-700 dark:text-indigo-300 mx-auto">
                  {avatarLetter}
                </div>
                <div className="mt-4 text-center">
                  <button 
                    type="button" 
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    disabled={true}
                  >
                    Change Profile Picture
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(Coming soon)</p>
                </div>
              </div>
              
              <div className="sm:w-2/3">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                
                {message.text && (
                  <div className={`mb-4 p-3 rounded-md ${
                    message.type === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' 
                      : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
                  }`}>
                    {message.text}
                  </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      value={lastName}
                      onChange={handleLastNameChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="matrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Matricule
                    </label>
                    <input
                      type="text"
                      id="matrice"
                      value={user?.matricule || ''}
                      disabled
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Matricule cannot be changed</p>
                  </div>
                  
                  <div className="pt-5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        isLoading 
                          ? 'bg-indigo-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>

            {passwordMessage.text && (
              <div className={`mb-4 p-3 rounded-md ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div>
                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="current_password"
                    value={currentPassword}
                    onChange={(e) => handlePasswordChange(e, 'current')}
                    className="block w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {showCurrentPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new_password"
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e, 'new')}
                    className="block w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {showNewPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters</p>
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => handlePasswordChange(e, 'confirm')}
                    className="block w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isPasswordLoading 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isPasswordLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Profile; 