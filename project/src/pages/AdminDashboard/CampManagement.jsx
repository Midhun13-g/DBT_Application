import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Search, Filter } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { formatDate } from '../../utils/helpers';

const CampManagement = () => {
  const [camps, setCamps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showCampModal, setShowCampModal] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  useEffect(() => {
    const mockCamps = [
      {
        id: 1,
        location: 'Delhi - Connaught Place',
        date: new Date('2024-02-15'),
        timeSlots: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
        capacity: 100,
        booked: 75,
        status: 'ACTIVE'
      },
      {
        id: 2,
        location: 'Mumbai - Bandra',
        date: new Date('2024-02-20'),
        timeSlots: ['10:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'],
        capacity: 80,
        booked: 45,
        status: 'ACTIVE'
      }
    ];

    const mockBookings = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      userName: `User ${index + 1}`,
      userEmail: `user${index + 1}@example.com`,
      campLocation: mockCamps[index % 2].location,
      campDate: mockCamps[index % 2].date,
      timeSlot: mockCamps[index % 2].timeSlots[index % 2],
      status: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'][index % 4],
      bookingReference: `BK${String(index + 1).padStart(6, '0')}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));

    setCamps(mockCamps);
    setBookings(mockBookings);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { color: 'yellow', text: 'Pending' },
      'CONFIRMED': { color: 'green', text: 'Confirmed' },
      'CANCELLED': { color: 'red', text: 'Cancelled' },
      'COMPLETED': { color: 'blue', text: 'Completed' },
      'ACTIVE': { color: 'green', text: 'Active' }
    };
    
    const badge = badges[status] || { color: 'gray', text: 'Unknown' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
        {badge.text}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Camp Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Camps
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {camps.filter(c => c.status === 'ACTIVE').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Bookings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {bookings.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Approvals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {bookings.filter(b => b.status === 'PENDING').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Locations
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {new Set(camps.map(c => c.location.split(' - ')[0])).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Camps */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Active Camps</h3>
            <Button icon={Plus} onClick={() => setShowCampModal(true)}>
              Add Camp
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {camps.map(camp => (
              <div key={camp.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{camp.location}</h4>
                    <p className="text-sm text-gray-500">{formatDate(camp.date)}</p>
                  </div>
                  {getStatusBadge(camp.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Capacity:</span>
                    <span>{camp.booked}/{camp.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(camp.booked / camp.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Time Slots: {camp.timeSlots.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Bookings Management */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Camp Bookings</h3>
            
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Search bookings..."
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Camp Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.slice(0, 10).map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.bookingReference}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.campLocation}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.campDate)} - {booking.timeSlot}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <Button size="sm" variant="outline">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Add Camp Modal */}
      <Modal
        isOpen={showCampModal}
        onClose={() => setShowCampModal(false)}
        title="Add New Camp"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter camp location"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time Slots</label>
            <div className="mt-2 space-y-2">
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="9:00 AM - 12:00 PM"
              />
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="2:00 PM - 5:00 PM"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowCampModal(false)}>
              Cancel
            </Button>
            <Button>
              Create Camp
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampManagement;