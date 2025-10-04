import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Calendar } from 'lucide-react';
import Card, { MetricCard } from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 125430,
    dbtEnabled: 98765,
    pendingRequests: 15234,
    campBookings: 3456
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          return;
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md mx-auto text-center">
          <div className="text-red-600 mb-4">
            <Clock className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </Card>
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