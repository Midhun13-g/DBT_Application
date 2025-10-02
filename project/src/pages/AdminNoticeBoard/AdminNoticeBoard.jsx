import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Bell, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { DISTRICTS } from '../../utils/constants';
import noticeService from '../../services/noticeService';

const AdminNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'GENERAL',
    priority: 'MEDIUM',
    district: '',
    eventDate: '',
    attachmentUrl: '',
    isActive: true
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = () => {
    const notices = noticeService.initializeDummyData();
    setNotices(notices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await noticeService.updateNotice(editingNotice.id, formData);
      } else {
        await noticeService.createNotice(formData);
      }
      loadNotices();
      resetForm();
    } catch (error) {
      console.error('Error saving notice:', error);
      alert('Error saving notice. Please try again.');
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      priority: notice.priority,
      district: notice.district,
      eventDate: notice.eventDate ? notice.eventDate.slice(0, 16) : '',
      attachmentUrl: notice.attachmentUrl || '',
      isActive: notice.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await noticeService.deleteNotice(id);
        loadNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Error deleting notice. Please try again.');
      }
    }
  };

  const handleView = async (notice) => {
    setViewingNotice(notice);
    try {
      // Increment view count
      const updatedNotice = { ...notice, views: notice.views + 1 };
      await noticeService.updateNotice(notice.id, updatedNotice);
      loadNotices();
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'GENERAL',
      priority: 'MEDIUM',
      district: '',
      eventDate: '',
      attachmentUrl: '',
      isActive: true
    });
    setEditingNotice(null);
    setShowModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'CAMP': return Calendar;
      case 'DEADLINE': return Clock;
      case 'EVENT': return Bell;
      case 'WORKSHOP': return Users;
      case 'SCHOLARSHIP': return CheckCircle;
      default: return Bell;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notice Board Management
            </h1>
            <p className="text-gray-600">
              Create and manage notices for the community
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Notice</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notices</p>
                <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Notices</p>
                <p className="text-2xl font-bold text-green-600">
                  {notices.filter(n => n.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Notices</p>
                <p className="text-2xl font-bold text-red-600">
                  {notices.filter(n => n.priority === 'URGENT').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">
                  {notices.reduce((sum, n) => sum + n.views, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Notices Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notices.map((notice) => {
                  const TypeIcon = getTypeIcon(notice.type);
                  return (
                    <tr key={notice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <TypeIcon className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {notice.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {notice.content.substring(0, 100)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {notice.type}
                          </span>
                          <br />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(notice.priority)}`}>
                            {notice.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {notice.district || 'All Districts'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {notice.eventDate ? formatDate(notice.eventDate) : 'No date'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {notice.views}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          notice.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {notice.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(notice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(notice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(notice.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={resetForm}
          title={editingNotice ? 'Edit Notice' : 'Add New Notice'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="GENERAL">General</option>
                  <option value="CAMP">Camp</option>
                  <option value="DEADLINE">Deadline</option>
                  <option value="EVENT">Event</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="SCHOLARSHIP">Scholarship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Districts</option>
                  {DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active (visible to users)
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingNotice ? 'Update Notice' : 'Create Notice'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={!!viewingNotice}
          onClose={() => setViewingNotice(null)}
          title="Notice Details"
        >
          {viewingNotice && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {viewingNotice.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(viewingNotice.priority)}`}>
                    {viewingNotice.priority}
                  </span>
                  <span className="text-sm text-gray-500">
                    Type: {viewingNotice.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    Views: {viewingNotice.views}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-700">{viewingNotice.content}</p>
              </div>

              {viewingNotice.eventDate && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(viewingNotice.eventDate)}</span>
                </div>
              )}

              {viewingNotice.district && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{viewingNotice.district}</span>
                </div>
              )}

              <div className="text-sm text-gray-500 pt-4 border-t">
                <p>Created: {formatDate(viewingNotice.createdAt)}</p>
                <p>Updated: {formatDate(viewingNotice.updatedAt)}</p>
                <p>Author: {viewingNotice.author}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminNoticeBoard;