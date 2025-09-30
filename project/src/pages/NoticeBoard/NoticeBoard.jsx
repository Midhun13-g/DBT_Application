import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, AlertCircle, FileText, Plus, Upload } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { useAuth } from '../../hooks/useAuth';

const NoticeBoard = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [filters, setFilters] = useState({
    district: '',
    type: '',
    keyword: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: '',
    priority: 'MEDIUM',
    district: '',
    eventDate: '',
    attachments: []
  });

  const noticeTypes = ['CAMP', 'DEADLINE', 'EVENT', 'WORKSHOP', 'GENERAL', 'SCHOLARSHIP'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const districts = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800'
  };

  const typeColors = {
    CAMP: 'bg-green-100 text-green-800',
    DEADLINE: 'bg-red-100 text-red-800',
    EVENT: 'bg-purple-100 text-purple-800',
    WORKSHOP: 'bg-blue-100 text-blue-800',
    GENERAL: 'bg-gray-100 text-gray-800',
    SCHOLARSHIP: 'bg-yellow-100 text-yellow-800'
  };

  useEffect(() => {
    // Mock data - replace with API call
    setNotices([
      {
        id: 1,
        title: 'DBT Awareness Camp - March 2024',
        content: 'Join us for a comprehensive DBT awareness camp covering account linking, status checking, and benefit tracking.',
        district: 'Delhi',
        type: 'CAMP',
        priority: 'HIGH',
        eventDate: '2024-03-15T10:00:00',
        createdAt: '2024-03-01T09:00:00'
      },
      {
        id: 2,
        title: 'Scholarship Application Deadline Extended',
        content: 'The deadline for Pre-Matric scholarship applications has been extended to March 31, 2024.',
        district: 'Mumbai',
        type: 'DEADLINE',
        priority: 'URGENT',
        eventDate: '2024-03-31T23:59:59',
        createdAt: '2024-03-02T14:30:00'
      }
    ]);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = () => {
    // Filter notices based on search criteria
    console.log('Searching with filters:', filters);
  };

  const handleCreateNotice = () => {
    // Create new notice
    console.log('Creating notice:', newNotice);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Notice Board</h1>
              <p className="text-gray-600 mt-2">Stay updated with latest announcements and events</p>
            </div>
            {(user?.role === 'GRAM_PANCHAYAT' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
                Add Notice
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.keyword}
                  onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.district}
                onChange={(e) => setFilters({...filters, district: e.target.value})}
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                {noticeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" icon={Filter} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <Card key={notice.id} className="h-full hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeColors[notice.type]}`}>
                      {notice.type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[notice.priority]}`}>
                      {notice.priority}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                <p className="text-gray-600 mb-4 flex-1">{notice.content}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{notice.district}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(notice.eventDate)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setSelectedNotice(notice);
                      setShowDetailsModal(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Notice Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Notice Details"
          size="lg"
        >
          {selectedNotice && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedNotice.title}</h3>
                  <div className="flex space-x-2 mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeColors[selectedNotice.type]}`}>
                      {selectedNotice.type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[selectedNotice.priority]}`}>
                      {selectedNotice.priority}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedNotice.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedNotice.district}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(selectedNotice.eventDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📞 Helpline: 1800-11-1400</p>
                    <p>📧 Email: support@dbt.gov.in</p>
                    <p>🏢 Local Office: District Collectorate</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Important Instructions</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                    <li>Bring original documents for verification</li>
                    <li>Arrive 15 minutes before the scheduled time</li>
                    <li>Mobile phones must be switched off during sessions</li>
                    <li>Free refreshments will be provided</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={FileText}>
                    Download Notice PDF
                  </Button>
                  <Button variant="outline" size="sm" icon={FileText}>
                    Event Poster
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Create Notice Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add New Notice"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newNotice.title}
                onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newNotice.content}
                onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newNotice.type}
                  onChange={(e) => setNewNotice({...newNotice, type: e.target.value})}
                >
                  <option value="">Select type</option>
                  {noticeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newNotice.priority}
                  onChange={(e) => setNewNotice({...newNotice, priority: e.target.value})}
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newNotice.district}
                  onChange={(e) => setNewNotice({...newNotice, district: e.target.value})}
                >
                  <option value="">Select district</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Date (Optional)</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newNotice.eventDate}
                onChange={(e) => setNewNotice({...newNotice, eventDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload PDF, images, or posters</p>
                <input type="file" multiple className="hidden" />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateModal(false)}>Create Notice</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default NoticeBoard;