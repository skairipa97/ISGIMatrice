import React from 'react';

const AdminDashboard = ({ user, onLogout }) => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name || 'Admin'}!</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard; 