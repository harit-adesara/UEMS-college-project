import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar animate-fade-in">
      <Link to={user ? "/dashboard" : "/"} className="brand">
        ✨ UEMS
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/events">Events</Link>
            <span>Hello, {user.fullName} ({user.role})</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{padding: '0.4rem 1rem'}}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
