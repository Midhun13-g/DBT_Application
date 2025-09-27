import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, Clock, Calendar, Search, Upload, Download, Filter, BarChart3, TrendingUp, AlertCircle, FileText, Eye, CreditCard as Edit, Trash2 } from 'lucide-react';
import Card, { MetricCard } from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader/Loader';
import { DBT_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 125430,
    dbtEnabled: 98765,
    pendingRequests: 15234,
    campBookings: 3456,
    recentActivity: []
  });

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock user data
      const mockUsers = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        phone: `98765${String(index + 1).padStart(5, '0')}`,
        aadhaarLast4: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        applicationId: `APP${String(index + 1).padStart(8, '0')}`,
        status: [DBT_STATUS.ENABLED, DBT_STATUS.LINKED_NOT_ENABLED, DBT_STATUS.NOT_LINKED][index % 3],
        lastChecked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        bankName: ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'PNB'][index % 5]
      }));
      
      setUserData(mockUsers);
      setLoading(false);
    };

    fetchData();
  }, []);

  const metrics = [
    {
      title: t('admin.totalUsers'),
      value: dashboardData.totalUsers.toLocaleString(),
      subtitle: '+12% from last month',
      icon: Users,
      trend: 'up',
      trendValue: '12%'
    },
    {
      title: t('admin.dbtEnabled'),
      value: dashboardData.dbtEnabled.toLocaleString(),
      subtitle: '78.7% success rate',
      icon: CheckCircle,
      trend: 'up',
      trendValue: '5.2%'
    },
    {
      title: t('admin.pendingRequests'),
      value: dashboardData.pendingRequests.toLocaleString(),
      subtitle: 'Needs attention',
      icon: Clock,
      trend: 'down',
      trendValue: '8%'
    },
    {
      title: t('admin.campBookings'),
      value: dashboardData.campBookings.toLocaleString(),
      subtitle: 'This month',
      icon: Calendar,
      trend: 'up',
      trendValue: '23%'
    }
  ];

  const filteredUsers = userData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.aadhaarLast4.includes(searchTerm) ||
                         user.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const badges = {
      [DBT_STATUS.ENABLED]: { color: 'green', text: 'Enabled' },
      [DBT_STATUS.LINKED_NOT_ENABLED]: { color: 'yellow', text: 'Linked' },
      [DBT_STATUS.NOT_LINKED]: { color: 'red', text: 'Not Linked' }
    };
    
    const badge = badges[status] || { color: 'gray', text: 'Unknown' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
        {badge.text}
      </span>
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoading(false);
    setShowBulkUpload(false);
    setSelectedFile(null);
    alert('Bulk upload completed successfully!');
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Aadhaar Last 4', 'Application ID', 'Status', 'Bank', 'Last Checked'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.aadhaarLast4,
        user.applicationId,
        user.status,
        user.bankName,
        formatDate(user.lastChecked)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dbt_users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && userData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.title')}
          </h1>
          <p className="text-gray-600">
            Monitor and manage DBT status across all users
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Actions Bar */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('admin.searchPlaceholder')}
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value={DBT_STATUS.ENABLED}>DBT Enabled</option>
                <option value={DBT_STATUS.LINKED_NOT_ENABLED}>Linked Not Enabled</option>
                <option value={DBT_STATUS.NOT_LINKED}>Not Linked</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                icon={Upload}
                onClick={() => setShowBulkUpload(true)}
              >
                {t('admin.bulkUpload')}
              </Button>
              <Button
                variant="outline"
                icon={Download}
                onClick={exportData}
              >
                {t('admin.exportData')}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aadhaar/App ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Checked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ****{user.aadhaarLast4}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.applicationId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.bankName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastChecked)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{filteredUsers.length}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        title="Bulk Upload CSV"
        size="md"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-sm text-gray-600 mb-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>{' '}
                or drag and drop
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </div>
            <p className="text-xs text-gray-500">CSV files only</p>
          </div>

          {selectedFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-green-800">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">CSV Format Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Headers: Name, Email, Phone, Aadhaar_Last4, Application_ID</li>
                  <li>Maximum 1000 records per upload</li>
                  <li>File size limit: 5MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => setShowBulkUpload(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkUpload}
            disabled={!selectedFile}
            loading={loading}
            icon={Upload}
          >
            Upload
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;