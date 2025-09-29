import React from 'react';
import { LogOut, Shield, Settings, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../NotificationBell/NotificationBell';

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
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-blue-800 text-white placeholder-blue-300 border border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <NotificationBell />
            
            <button className="p-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded">
              <Settings className="h-5 w-5" />
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