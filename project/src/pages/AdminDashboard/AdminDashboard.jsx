import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Calendar } from 'lucide-react';
import Card, { MetricCard } from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 125430,
    dbtEnabled: 98765,
    pendingRequests: 15234,
    campBookings: 3456
  });

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchData();
  }, []);

  const metrics = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers.toLocaleString(),
      subtitle: '+12% from last month',
      icon: Users,
      trend: 'up',
      trendValue: '12%'
    },
    {
      title: 'DBT Enabled',
      value: dashboardData.dbtEnabled.toLocaleString(),
      subtitle: '78.7% success rate',
      icon: CheckCircle,
      trend: 'up',
      trendValue: '5.2%'
    },
    {
      title: 'Pending Requests',
      value: dashboardData.pendingRequests.toLocaleString(),
      subtitle: 'Needs attention',
      icon: Clock,
      trend: 'down',
      trendValue: '8%'
    },
    {
      title: 'Camp Bookings',
      value: dashboardData.campBookings.toLocaleString(),
      subtitle: 'This month',
      icon: Calendar,
      trend: 'up',
      trendValue: '23%'
    }
  ];



  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" text="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Key metrics and system status
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            icon={metric.icon}
            trend={metric.trend}
            trendValue={metric.trendValue}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;