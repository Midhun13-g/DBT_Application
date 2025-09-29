import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, MapPin, Settings, Home, BookOpen, Activity } from 'lucide-react';

const AdminSidebar = () => {
  const navigation = [
    { name: 'Overview', href: '/admin', icon: BarChart3, exact: true },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Camp Management', href: '/admin/camps', icon: MapPin },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Awareness Materials', href: '/admin/awareness', icon: BookOpen },
    { name: 'Access Logs', href: '/admin/logs', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-full">
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.exact}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <NavLink
            to="/"
            className="group flex items-center px-3 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
          >
            <Home className="mr-3 h-5 w-5" />
            Back to Main Site
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;