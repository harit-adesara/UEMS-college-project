import React from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onUpdate, isRegistered }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleRegister = async () => {
    try {
      const res = await apiClient.post(`/register/event/${event._id}`);
      const data = res.data.data;

      // Free event
      if (!data.isPaid) {
        alert('Successfully registered for free event!');
        if (onUpdate) onUpdate();
        return;
      }

      // Paid event (Razorpay Flow)
      const { orderId, amount, currency } = data.order;

      const options = {
        key: 'rzp_test_SUCYdAwQkzdrkQ', // Match backend test key
        amount: amount,
        currency: currency,
        name: 'UEMS Events',
        description: `Registration for ${event.name}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await apiClient.post('/verifyPayment', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              eventId: event._id
            });
            alert('Payment Successful & Registered!');
            if (onUpdate) onUpdate();
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.fullname,
          email: user?.email,
        },
        theme: {
          color: '#a855f7'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert(response.error.description || 'Payment Failed');
      });
      rzp.open();

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register');
    }
  };

  const handleApprove = async () => {
    try {
      await apiClient.post(`/approve/event/${event._id}`);
      alert('Event approved!');
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async () => {
    try {
      await apiClient.post(`/reject/event/${event._id}`);
      alert('Event rejected!');
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  const handleDelete = async () => {
    if(!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiClient.delete(`/event/delete/${event._id}`);
      alert('Event deleted!');
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 
            onClick={() => navigate(`/events/${event._id}`, { state: { event, isRegistered } })}
            style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-color)', cursor: 'pointer', display: 'inline-block' }}
          >
            {event.name}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>{event.detail.length > 100 ? event.detail.substring(0, 100) + '...' : event.detail}</p>
        </div>
        <span style={{ 
          padding: '0.25rem 0.75rem', 
          borderRadius: '999px', 
          fontSize: '0.875rem', 
          background: event.status === 'Accepted' ? 'rgba(16, 185, 129, 0.2)' : event.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: event.status === 'Accepted' ? '#10b981' : event.status === 'Pending' ? '#f59e0b' : '#ef4444'
        }}>
          {event.status || 'Pending'}
        </span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <div><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
        <div><strong>Location:</strong> {event.venue}</div>
        <div><strong>Organizer Name:</strong> {event.organizedBy}</div>
        {event.amount > 0 && <div><strong>Price:</strong> ₹{event.amount}</div>}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate(`/events/${event._id}`, { state: { event, isRegistered } })} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          View Details
        </button>

        {event.status === 'Accepted' && event.organizedBy !== user?.fullname && !isRegistered && user?.role === 'Student' && (
          <button onClick={handleRegister} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Register Now
          </button>
        )}
        {event.status === 'Accepted' && isRegistered && user?.role === 'Student' && (
          <button disabled className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', opacity: 0.7, cursor: 'not-allowed', borderColor: 'var(--success-color)', color: 'var(--success-color)' }}>
            Already Registered
          </button>
        )}
        
        {user?.role === 'Admin' && event.status === 'Pending' && (
          <>
            <button onClick={handleApprove} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--success-color)' }}>
              Approve
            </button>
            <button onClick={handleReject} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>
              Reject
            </button>
          </>
        )}

        {event.organizedBy === user?.fullname && event.status === 'Pending' && (
          <>
            <button onClick={() => navigate(`/events/modify/${event._id}`, { state: { event } })} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
              Modify Event
            </button>
            <button onClick={handleDelete} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>
              Delete Event
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventCard;
