import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  User, 
  Users, 
  GraduationCap, 
  School, 
  MapPin, 
  BookOpen,
  Calendar,
  CheckCircle,
  Bell,
  Settings
} from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';

const RoleDashboard = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'STUDENT':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">My Scholarships</h3>
                    <p className="text-sm text-gray-600">Track applications and status</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">View Scholarships</Button>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">DBT Status</h3>
                    <p className="text-sm text-gray-600">Check account linking</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Check Status</Button>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Learning Hub</h3>
                    <p className="text-sm text-gray-600">Educational resources</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Start Learning</Button>
              </Card>
            </div>
          </div>
        );

      case 'PARENT':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Child's Progress</h3>
                    <p className="text-sm text-gray-600">Track academic progress</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">View Progress</Button>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">School Activities</h3>
                    <p className="text-sm text-gray-600">Upcoming events & meetings</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">View Activities</Button>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
                <div className="flex items-center space-x-3">
                  <Bell className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-600">Important updates</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">View Notices</Button>
              </Card>
            </div>
          </div>
        );

      case 'SCHOOL_COMMITTEE':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-500">
                <div className="flex items-center space-x-3">
                  <School className="h-8 w-8 text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Activities</h3>
                    <p className="text-sm text-gray-600">Create and manage events</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Manage Events</Button>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Attendance</h3>
                    <p className="text-sm text-gray-600">Track event participation</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">View Attendance</Button>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Resources</h3>
                    <p className="text-sm text-gray-600">Upload educational content</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Manage Resources</Button>
              </Card>
            </div>
          </div>
        );

      case 'GRAM_PANCHAYAT':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500">
                <div className="flex items-center space-x-3">
                  <Bell className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Post Notices</h3>
                    <p className="text-sm text-gray-600">Community announcements</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Create Notice</Button>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Local Events</h3>
                    <p className="text-sm text-gray-600">Organize community events</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Manage Events</Button>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Community</h3>
                    <p className="text-sm text-gray-600">Manage local community</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">View Community</Button>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">DBT Status</h3>
                    <p className="text-sm text-gray-600">Check your status</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Check Status</Button>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Learn More</h3>
                    <p className="text-sm text-gray-600">Educational resources</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Explore</Button>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Get Help</h3>
                    <p className="text-sm text-gray-600">Book assistance</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" size="sm">Book Camp</Button>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600">
            Role: {user?.role?.replace('_', ' ') || 'User'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      
      {getDashboardContent()}
    </div>
  );
};

export default RoleDashboard;