import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

const EventDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event;
  const isRegistered = state?.isRegistered;
  const { user } = useAuth();

  if (!event) {
    return (
      <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Event not found or session expired.</h2>
        <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/events')}>Return to Directory</button>
      </div>
    );
  }

  const handleRegister = async () => {
    try {
      const res = await apiClient.post(`/register/event/${event._id}`);
      const data = res.data.data;

      if (!data.isPaid) {
        alert('Successfully registered for free event!');
        navigate('/events?filter=my');
        return;
      }

      const { orderId, amount, currency } = data.order;
      const options = {
        key: 'rzp_test_SUCYdAwQkzdrkQ',
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
            navigate('/events?filter=my');
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.fullname,
          email: user?.email,
        },
        theme: { color: '#a855f7' }
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

  return (
    <div className="animate-fade-in page-container" style={{ alignItems: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '800px', marginTop: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Back to List
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {event.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Organized by {event.organizedBy}</p>
          </div>
          <span style={{ 
            padding: '0.4rem 1rem', 
            borderRadius: '999px', 
            fontSize: '1rem', 
            fontWeight: 600,
            background: event.status === 'Accepted' ? 'rgba(16, 185, 129, 0.2)' : event.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: event.status === 'Accepted' ? '#10b981' : event.status === 'Pending' ? '#f59e0b' : '#ef4444'
          }}>
            {event.status || 'Pending'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Date & Time</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{new Date(event.date).toLocaleString()}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Venue</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{event.venue}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Registration Fee</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, color: event.amount > 0 ? '#fff' : '#10b981' }}>
              {event.amount > 0 ? `₹${event.amount}` : 'Free'}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff' }}>Event Details</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
            {event.detail}
          </p>
        </div>

        {/* Action Panel */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {event.status === 'Accepted' && event.organizedBy !== user?.fullname && !isRegistered && user?.role === 'Student' && (
            <button onClick={handleRegister} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
              Register Now
            </button>
          )}

          {event.status === 'Accepted' && isRegistered && user?.role === 'Student' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✓</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>TICKET SECURED</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You are officially registered for this event.</p>
            </div>
          )}

          {event.organizedBy === user?.fullname && (
             <div style={{ color: 'var(--accent-color)', fontWeight: '500' }}>You are the organizer of this event.</div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default EventDetails;
