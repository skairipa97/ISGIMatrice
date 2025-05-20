import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (password !== passwordConfirmation) {
    setError('Passwords do not match');
    return;
  }

  setLoading(true);

  try {
    // Remove token validation
    const email = searchParams.get('email');

    const response = await axios.post('http://localhost:8000/api/reset-password', {
      token,
      email: decodeURIComponent(email),
      password,
      password_confirmation: passwordConfirmation
    });
    
    if (response.data.message) {
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError('Unexpected response from server');
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error || 
                    err.response?.data?.message || 
                    'Failed to reset password';
    setError(errorMsg);
    console.error('Reset error:', err.response?.data);
  } finally {
    setLoading(false);
  }
};

  if (!token || !email) {
    return <div>Invalid reset link</div>;
  }

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {message && <div style={{color: 'green'}}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
        />
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;