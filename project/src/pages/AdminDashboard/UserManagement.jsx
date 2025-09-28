import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Upload, Eye, Edit, Trash2, UserPlus, Mail, Phone } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { formatDate } from '../../utils/helpers';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Mock data - replace with API call
  useEffect(() => {
    const mockUsers = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      phone: `98765${String(index + 1).padStart(5, '0')}`,
      aadhaarLast4: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
      applicationId: `APP${String(index + 1).padStart(8, '0')}`,
      status: ['ENABLED', 'LINKED_NOT_ENABLED', 'NOT_LINKED'][index % 3],
      lastChecked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      bankName: ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'PNB'][index % 5],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      isActive: Math.random() > 0.1
    }));
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const badges = {
      'ENABLED': { color: 'green', text: 'Enabled' },
      'LINKED_NOT_ENABLED': { color: 'yellow', text: 'Linked' },
      'NOT_LINKED': { color: 'red', text: 'Not Linked' }
    };
    
    const badge = badges[status] || { color: 'gray', text: 'Unknown' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
        {badge.text}
      </span>
    );
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkStatusUpdate = (newStatus) => {
    // API call to update multiple users
    console.log('Updating users:', selectedUsers, 'to status:', newStatus);
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Bank', 'Created At'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.status,
        user.bankName,
        formatDate(user.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Search users..."
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="ENABLED">Enabled</option>
              <option value="LINKED_NOT_ENABLED">Linked</option>
              <option value="NOT_LINKED">Not Linked</option>
            </select>
          </div>

          <div className="flex space-x-3">
            {selectedUsers.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowBulkActions(true)}
              >
                Bulk Actions ({selectedUsers.length})
              </Button>
            )}
            <Button variant="outline" icon={Upload}>
              Import
            </Button>
            <Button variant="outline" icon={Download} onClick={exportUsers}>
              Export
            </Button>
            <Button icon={UserPlus}>
              Add User
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(paginatedUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Check
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.applicationId}</div>
                      <div className="text-sm text-gray-500">****{user.aadhaarLast4}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                    {!user.isActive && (
                      <div className="text-xs text-red-600 mt-1">Inactive</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.bankName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(user.lastChecked)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowUserModal(false)}>
                Close
              </Button>
              <Button>
                Edit User
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal
        isOpen={showBulkActions}
        onClose={() => setShowBulkActions(false)}
        title="Bulk Actions"
      >
        <div className="space-y-4">
          <p>Selected {selectedUsers.length} users</p>
          <div className="flex space-x-3">
            <Button onClick={() => handleBulkStatusUpdate('ENABLED')}>
              Mark as Enabled
            </Button>
            <Button onClick={() => handleBulkStatusUpdate('LINKED_NOT_ENABLED')}>
              Mark as Linked
            </Button>
            <Button variant="outline" onClick={() => handleBulkStatusUpdate('NOT_LINKED')}>
              Mark as Not Linked
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;