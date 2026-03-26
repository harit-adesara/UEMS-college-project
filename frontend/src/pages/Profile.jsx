import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

const Profile = () => {
  const { user, checkCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    username: user?.username || '',
    roll_number: user?.roll_number || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        fullname: formData.fullname,
        username: formData.username,
      };
      if (user?.role === 'Student') {
        payload.roll_number = formData.roll_number;
      }
      
      await apiClient.patch('/update/profile', payload);
      setSuccess('Profile updated successfully!');
      checkCurrentUser(); // Refresh auth context user state
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Update Profile
        </h2>

        {error && <div className="error-msg">{error}</div>}
        {success && <div style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}

        <form onSubmit={handleUpdate}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullname" 
              required
              value={formData.fullname} 
              onChange={handleChange} 
            />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              required
              value={formData.username} 
              onChange={handleChange} 
            />
          </div>

          {user?.role === 'Student' && (
            <div className="input-group">
              <label>Roll Number</label>
              <input 
                type="text" 
                name="roll_number" 
                required
                value={formData.roll_number} 
                onChange={handleChange} 
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
