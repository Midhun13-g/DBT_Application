import React from 'react';
import { Bell, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-700 p-2 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DBT Admin Portal</h1>
              <p className="text-blue-200 text-sm">Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-blue-200 hover:text-white hover:bg-red-600 rounded transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;