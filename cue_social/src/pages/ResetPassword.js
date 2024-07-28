import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ROUTE } from '../constants';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`${ROUTE}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      if (response.ok) {
        alert('Password has been reset.');
      } else {
        alert('Failed to reset password.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while resetting the password.');
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;