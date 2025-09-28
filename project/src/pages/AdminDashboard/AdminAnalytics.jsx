import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock, Calendar } from 'lucide-react';
import Card from '../../components/Card/Card';

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    statusDistribution: [
      { name: 'Enabled', value: 65, color: '#10B981' },
      { name: 'Linked Not Enabled', value: 25, color: '#F59E0B' },
      { name: 'Not Linked', value: 10, color: '#EF4444' }
    ],
    monthlyTrends: [
      { month: 'Jan', enabled: 1200, linked: 800, notLinked: 400 },
      { month: 'Feb', enabled: 1400, linked: 900, notLinked: 350 },
      { month: 'Mar', enabled: 1600, linked: 1000, notLinked: 300 },
      { month: 'Apr', enabled: 1800, linked: 1100, notLinked: 250 },
      { month: 'May', enabled: 2000, linked: 1200, notLinked: 200 },
      { month: 'Jun', enabled: 2200, linked: 1300, notLinked: 180 }
    ],
    campBookings: [
      { location: 'Delhi', bookings: 450 },
      { location: 'Mumbai', bookings: 380 },
      { location: 'Bangalore', bookings: 320 },
      { location: 'Chennai', bookings: 290 },
      { location: 'Kolkata', bookings: 250 }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Status Distribution */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">DBT Status Distribution</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {analyticsData.statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly DBT Status Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analyticsData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="enabled" stroke="#10B981" strokeWidth={3} name="Enabled" />
              <Line type="monotone" dataKey="linked" stroke="#F59E0B" strokeWidth={3} name="Linked" />
              <Line type="monotone" dataKey="notLinked" stroke="#EF4444" strokeWidth={3} name="Not Linked" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Camp Bookings by Location */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Camp Bookings by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.campBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalytics;