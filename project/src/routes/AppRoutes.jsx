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
import UserManagement from '../pages/AdminDashboard/UserManagement';
import CampManagement from '../pages/AdminDashboard/CampManagement';
import AdminAnalytics from '../pages/AdminDashboard/AdminAnalytics';
import AdminSettings from '../pages/AdminSettings/AdminSettings';
import AdminOverview from '../pages/AdminDashboard/AdminOverview';
import AwarenessManagement from '../pages/AdminDashboard/AwarenessManagement/AwarenessManagement';
import AccessLogs from '../pages/AdminDashboard/AccessLogs/AccessLogs';
import Notifications from '../pages/Notifications/Notifications';
import Profile from '../pages/Profile/Profile';
import SchemeDetails from '../pages/Schemes/SchemeDetails';
import NoticeBoard from '../pages/NoticeBoard/NoticeBoard';
import SchoolActivities from '../pages/SchoolActivities/SchoolActivities';
import KnowledgeHub from '../pages/KnowledgeHub/KnowledgeHub';
import Events from '../pages/Events/Events';
import AdminEvents from '../pages/AdminEvents/AdminEvents';

import AdminLayout from '../layouts/AdminLayout';

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
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/schemes/:schemeId" element={<SchemeDetails />} />
      <Route path="/notice-board" element={<NoticeBoard />} />
      <Route path="/school-activities" element={<SchoolActivities />} />
      <Route path="/knowledge-hub" element={<KnowledgeHub />} />
      <Route path="/events" element={<Events />} />

      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace /> : <Login />} 
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
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="camps" element={<CampManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="awareness" element={<AwarenessManagement />} />
        <Route path="school-activities" element={<SchoolActivities />} />
        <Route path="notices" element={<NoticeBoard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="logs" element={<AccessLogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;