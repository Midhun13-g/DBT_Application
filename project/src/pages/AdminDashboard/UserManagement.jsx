import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Upload, Eye, Edit, Trash2, UserPlus, Mail, Phone, AlertTriangle } from 'lucide-react';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const realUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@dbt.gov.in',
        phone: '9876543210',
        aadhaarLast4: '1234',
        applicationId: 'APP00000001',
        status: 'ENABLED',
        lastChecked: new Date(),
        bankName: 'SBI',
        createdAt: new Date('2024-01-01'),
        isActive: true,
        role: 'ADMIN'
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'user@example.com',
        phone: '9876543211',
        aadhaarLast4: '5678',
        applicationId: 'APP00000002',
        status: 'LINKED_NOT_ENABLED',
        lastChecked: new Date(),
        bankName: 'HDFC',
        createdAt: new Date('2024-01-02'),
        isActive: true,
        role: 'USER'
      },
      ...Array.from({ length: 20 }, (_, index) => ({
        id: index + 3,
        name: `User ${index + 3}`,
        email: `user${index + 3}@example.com`,
        phone: `98765${String(index + 3).padStart(5, '0')}`,
        aadhaarLast4: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        applicationId: `APP${String(index + 3).padStart(8, '0')}`,
        status: ['ENABLED', 'LINKED_NOT_ENABLED', 'NOT_LINKED'][index % 3],
        lastChecked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        bankName: ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'PNB'][index % 5],
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        isActive: Math.random() > 0.1,
        role: 'USER'
      }))
    ];
    setUsers(realUsers);
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
    const badgeClasses = {
      'ENABLED': 'bg-green-100 text-green-800',
      'LINKED_NOT_ENABLED': 'bg-yellow-100 text-yellow-800',
      'NOT_LINKED': 'bg-red-100 text-red-800'
    };
    
    const badgeText = {
      'ENABLED': 'Enabled',
      'LINKED_NOT_ENABLED': 'Linked',
      'NOT_LINKED': 'Not Linked'
    };
    
    const classes = badgeClasses[status] || 'bg-gray-100 text-gray-800';
    const text = badgeText[status] || 'Unknown';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
        {text}
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

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // API call to delete user
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Remove user from local state
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      
      setShowDeleteModal(false);
      setUserToDelete(null);
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
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
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkActions(true)}
                >
                  Bulk Actions ({selectedUsers.length})
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleBulkStatusUpdate('ENABLED')}
                >
                  Enable Selected
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => console.log('Bulk delete:', selectedUsers)}
                >
                  Delete Selected
                </Button>
              </div>
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
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.role === 'ADMIN' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        )}
                      </div>
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
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => confirmDeleteUser(user)}
                        disabled={user.role === 'ADMIN'}
                        title={user.role === 'ADMIN' ? 'Cannot delete admin user' : 'Delete user'}
                      >
                        <Trash2 className={`h-4 w-4 ${user.role === 'ADMIN' ? 'opacity-50 cursor-not-allowed' : ''}`} />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        {userToDelete && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <strong>{userToDelete.name}</strong>? 
                  This action cannot be undone and will also delete all associated bookings.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;