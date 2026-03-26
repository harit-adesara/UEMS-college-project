import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-container animate-fade-in" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', textAlign: 'center', padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '900px', padding: '4rem 2rem', borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <h1 style={{
          fontSize: '4.5rem', fontWeight: 800, marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1.2
        }}>
          University Event<br/>Management System
        </h1>
        <p style={{
          fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem',
          maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6
        }}>
          Discover, register, and manage campus events with seamless precision. 
          Experience the next generation of academic and cultural engagement.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{
            padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '999px',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)', transition: 'transform 0.2s',
            fontWeight: 600
          }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline" style={{
            padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '999px',
            fontWeight: 600
          }}>
            Login to Portal
          </Link>
        </div>

        <div style={{ 
          marginTop: '4.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3.5rem'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Discover Events</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Find the latest workshops, cultural fests, and tech symposiums.</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎫</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Easy Registration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Secure your spot instantly with our seamless ticketing system.</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Organizer Hub</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage attendees, approvals, and event metrics effortlessly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
