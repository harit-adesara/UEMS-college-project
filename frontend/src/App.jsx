import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventCreate from './pages/EventCreate';
import EventDetails from './pages/EventDetails';
import EventModify from './pages/EventModify';
import AdminCreateUser from './pages/AdminCreateUser';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import './App.css';

function App() {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="page-container" style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="page-container animate-fade-in">
        <Navbar />
        <main className="content-wrapper">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/events/create" element={<ProtectedRoute><EventCreate /></ProtectedRoute>} />
            <Route path="/events/modify/:id" element={<ProtectedRoute><EventModify /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
            <Route path="/admin/create-user" element={<ProtectedRoute><AdminCreateUser /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
