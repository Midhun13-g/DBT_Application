import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Pages
import Home from '../pages/Home/Home';
import DBTStatusCheck from '../pages/DBTStatusCheck/DBTStatusCheck';
import SeedingGuide from '../pages/SeedingGuide/SeedingGuide';
import Awareness from '../pages/Awareness/Awareness';
import CampBooking from '../pages/CampBooking/CampBooking';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';

// Route Protection Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/dbt-check" element={<DBTStatusCheck />} />
      <Route path="/seeding-guide" element={<SeedingGuide />} />
      <Route path="/awareness" element={<Awareness />} />
      <Route path="/camp-booking" element={<CampBooking />} />
      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/" replace /> : <Signup />} 
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;