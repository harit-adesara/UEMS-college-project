import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    roll_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/register/user', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card animate-fade-in">
        <h2>Create Account</h2>
        <p>Join the University Event Management System</p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullname"
              required 
              value={formData.fullname}
              onChange={handleChange}
              placeholder="John Doe"
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
              placeholder="unique_username"
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              value={formData.email}
              onChange={handleChange}
              placeholder="john@university.edu"
            />
          </div>
          <div className="input-group">
            <label>Roll Number</label>
            <input 
              type="text" 
              name="roll_number"
              required 
              value={formData.roll_number}
              onChange={handleChange}
              placeholder="e.g. 2023CS01"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              required 
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
