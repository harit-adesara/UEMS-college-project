import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const EventCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    detail: '',
    date: '',
    venue: '',
    amount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/createEvent', formData);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Create New Event</h1>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Event Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          
          <div className="input-group">
            <label>Description</label>
            <textarea name="detail" rows="4" required value={formData.detail} onChange={handleChange}></textarea>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Date & Time</label>
              <input type="datetime-local" name="date" required value={formData.date} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>Location / Venue</label>
              <input type="text" name="venue" required value={formData.venue} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>Registration Fee ($)</label>
              <input type="number" name="amount" min="0" required value={formData.amount} onChange={handleChange} />
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreate;
