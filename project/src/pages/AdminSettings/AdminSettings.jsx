import React from 'react';
import Card from '../../components/Card/Card';

const AdminSettings = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          System Settings
        </h1>
        <p className="text-gray-600">
          Configure system preferences and settings
        </p>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Settings Panel</h3>
          <p className="text-gray-600">Settings functionality coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;