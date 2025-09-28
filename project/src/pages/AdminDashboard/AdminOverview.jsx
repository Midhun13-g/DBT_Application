import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Calendar, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import Card, { MetricCard } from '../../components/Card/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 125430,
    dbtEnabled: 98765,
    pendingRequests: 15234,
    campBookings: 3456,
    todayRegistrations: 234,
    successRate: 78.7
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'user_registered', message: 'New user registered', time: '2 minutes ago' },
    { id: 2, type: 'dbt_enabled', message: 'DBT status enabled for user', time: '5 minutes ago' },
    { id: 3, type: 'camp_booked', message: 'New camp booking', time: '8 minutes ago' },
    { id: 4, type: 'status_check', message: 'DBT status checked', time: '12 minutes ago' }
  ]);

  const weeklyData = [
    { day: 'Mon', users: 120, enabled: 95 },
    { day: 'Tue', users: 150, enabled: 118 },
    { day: 'Wed', users: 180, enabled: 142 },
    { day: 'Thu', users: 160, enabled: 125 },
    { day: 'Fri', users: 200, enabled: 158 },
    { day: 'Sat', users: 140, enabled: 110 },
    { day: 'Sun', users: 100, enabled: 78 }
  ];

  const statusDistribution = [
    { name: 'Enabled', value: 65, color: '#10B981' },
    { name: 'Linked', value: 25, color: '#F59E0B' },
    { name: 'Not Linked', value: 10, color: '#EF4444' }
  ];

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
      subtitle: `${dashboardData.successRate}% success rate`,
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
      title: 'Today Registrations',
      value: dashboardData.todayRegistrations.toLocaleString(),
      subtitle: 'New users today',
      icon: TrendingUp,
      trend: 'up',
      trendValue: '15%'
    }
  ];

  return (
    <div className="space-y-6">
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly User Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="New Users" />
                <Line type="monotone" dataKey="enabled" stroke="#10B981" strokeWidth={2} name="DBT Enabled" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">DBT Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* System Alerts */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">System Alerts</h3>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">High Pending Requests</p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">15,234 requests need attention</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">System Performance</p>
                </div>
                <p className="text-xs text-blue-700 mt-1">All systems operational</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-800">Daily Backup</p>
                </div>
                <p className="text-xs text-green-700 mt-1">Completed successfully</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;