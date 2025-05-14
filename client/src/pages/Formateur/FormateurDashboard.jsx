import React from 'react';

const FormateurDashboard = ({ user, onLogout }) => {
  return (
    <div className="formateur-dashboard">
      <h1>Formateur Dashboard</h1>
      <p>Welcome, {user?.name || 'Formateur'}!</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default FormateurDashboard; 