import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminTest = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Admin Panel Working!
        </h1>
        <p className="text-gray-600 mb-4">
          Admin dashboard is functioning correctly.
        </p>
        {user && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p><strong>User:</strong> {user.name}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTest;