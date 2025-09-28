import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader/AdminHeader';
import AdminSidebar from '../components/AdminSidebar/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;