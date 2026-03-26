import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const AdminCreateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    role: 'Teacher'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Prevent non-admins from accessing gracefully
  if (user?.role !== 'Admin') {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You must be an Administrator to view this page.</p>
        <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await apiClient.post('/createUser', formData);
      setSuccess(`User ${formData.username} created successfully as ${formData.role}!`);
      setFormData({ fullname: '', username: '', email: '', password: '', role: 'Teacher' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--accent-color)' }}>Admin: Create Organizer</h1>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Create a Teacher or Club account so they can organize events.
        </p>
        
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="error-msg" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="fullname" required value={formData.fullname} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" required value={formData.username} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Role</label>
            <select name="role" required value={formData.role} onChange={handleChange}>
              <option value="Teacher">Teacher</option>
              <option value="Club">Club</option>
            </select>
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} />
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating User...' : 'Create Organizer Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUser;
