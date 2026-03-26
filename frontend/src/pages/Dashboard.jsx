import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Role-based configurations for dashboard widgets
  const getRoleWidgets = () => {
    switch (user?.role) {
      case 'Student':
        return [
          {
            title: 'Browse Events',
            desc: 'Discover upcoming seminars, workshops, and college fests.',
            action: () => navigate('/events'),
            btnText: 'Explore',
            theme: 'blue',
            icon: '🌍'
          },
          {
            title: 'My Registrations',
            desc: 'View tickets and details for events you are attending.',
            action: () => navigate('/events?filter=my'),
            btnText: 'View Tickets',
            theme: 'purple',
            icon: '🎟️'
          },
          {
            title: 'Update Profile',
            desc: 'Modify your username, fullname, or roll number.',
            action: () => navigate('/profile'),
            btnText: 'Edit Profile',
            theme: 'gray',
            icon: '⚙️'
          }
        ];
      case 'Teacher':
      case 'Club':
        return [
          {
            title: 'Create Event',
            desc: 'Host a new activity and invite students across campus.',
            action: () => navigate('/events/create'),
            btnText: 'Host Event',
            theme: 'purple',
            icon: '✨'
          },
          {
            title: 'My Hosted Events',
            desc: 'Manage your events, view attendees, and update details.',
            action: () => navigate('/events?filter=my'), 
            btnText: 'Manage My Events',
            theme: 'blue',
            icon: '📊'
          },
          {
            title: 'My Registrations',
            desc: 'View tickets and details for events you are attending.',
            action: () => navigate('/events?filter=registered'),
            btnText: 'View Tickets',
            theme: 'purple',
            icon: '🎟️'
          },
          {
            title: 'Update Profile',
            desc: 'Keep your personal and organization details up to date.',
            action: () => navigate('/profile'),
            btnText: 'Edit Profile',
            theme: 'gray',
            icon: '⚙️'
          }
        ];
      case 'Admin':
        return [
          {
            title: 'Global Event Directory',
            desc: 'Monitor all campus events. Approve or reject pending requests.',
            action: () => navigate('/events'),
            btnText: 'Manage Options',
            theme: 'purple',
            icon: '🛡️'
          },
          {
            title: 'My Registrations',
            desc: 'View tickets and details for events you are attending.',
            action: () => navigate('/events?filter=registered'),
            btnText: 'View Tickets',
            theme: 'purple',
            icon: '🎟️'
          },
          {
            title: 'Onboard Organizer',
            desc: 'Create secure accounts for new Teachers or Clubs.',
            action: () => navigate('/admin/create-user'),
            btnText: 'Create Account',
            theme: 'blue',
            icon: 'Plus'
          },
          {
            title: 'Update Profile',
            desc: 'Change your administrative credentials and name.',
            action: () => navigate('/profile'),
            btnText: 'Edit Profile',
            theme: 'gray',
            icon: '⚙️'
          }
        ];
      default:
        return [];
    }
  };

  const widgets = getRoleWidgets();

  return (
    <div className="animate-fade-in page-container">
      {/* Welcome Hero Area */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '3rem 2rem', 
          marginBottom: '2rem', 
          background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--gradient-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          color: '#fff',
          boxShadow: '0 0 20px rgba(168,85,247,0.4)',
          flexShrink: 0
        }}>
          {user?.fullname?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Hello, {user?.fullname || 'User'}!
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Welcome to your <span style={{ color: 'var(--accent-color)', fontWeight: '600'}}>{user?.role}</span> workspace. What would you like to do today?
          </p>
        </div>
      </div>

      {/* Realistic Role-based Widgets Grid */}
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Quick Overview</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {widgets.map((widget, idx) => (
          <div 
            key={idx}
            className="glass-panel"
            style={{ 
              padding: '2rem', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={widget.action}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{widget.icon}</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{widget.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
              {widget.desc}
            </p>
            <button 
              className={`btn ${widget.theme === 'purple' ? 'btn-primary' : 'btn-outline'}`}
              style={{ width: '100%', marginTop: 'auto' }}
              onClick={(e) => {
                e.stopPropagation();
                widget.action();
              }}
            >
              {widget.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
