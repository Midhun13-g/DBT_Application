import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, Clock, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import communityActionService from '../../services/communityActionService';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { DISTRICTS } from '../../utils/constants';

const AdminEvents = () => {
  const [actions, setActions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [viewingAction, setViewingAction] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    actionType: 'AWARENESS_CAMP',
    targetAudience: 'ALL',
    district: '',
    panchayat: '',
    venue: '',
    actionDate: '',
    durationHours: '',
    maxParticipants: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    registrationRequired: false,
    registrationDeadline: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = () => {
    const actions = communityActionService.initializeDummyData();
    setActions(actions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const actionData = {
        ...formData,
        actionDate: formData.actionDate ? new Date(formData.actionDate).toISOString() : null,
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        durationHours: formData.durationHours ? parseInt(formData.durationHours) : null
      };

      if (editingAction) {
        await communityActionService.updateAction(editingAction.id, actionData);
      } else {
        await communityActionService.createAction(actionData);
      }

      loadActions();
      resetForm();
    } catch (error) {
      console.error('Error saving community action:', error);
      alert('Error saving community action. Please try again.');
    }
  };

  const handleEdit = (action) => {
    setEditingAction(action);
    setFormData({
      title: action.title,
      description: action.description,
      actionType: action.actionType,
      targetAudience: action.targetAudience,
      district: action.district || '',
      panchayat: action.panchayat || '',
      venue: action.venue || '',
      actionDate: action.actionDate ? action.actionDate.slice(0, 16) : '',
      durationHours: action.durationHours || '',
      maxParticipants: action.maxParticipants || '',
      contactPerson: action.contactPerson || '',
      contactPhone: action.contactPhone || '',
      contactEmail: action.contactEmail || '',
      registrationRequired: action.registrationRequired || false,
      registrationDeadline: action.registrationDeadline ? action.registrationDeadline.slice(0, 16) : '',
      isActive: action.isActive,
      isFeatured: action.isFeatured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this community action?')) {
      try {
        await communityActionService.deleteAction(id);
        loadActions();
      } catch (error) {
        console.error('Error deleting community action:', error);
        alert('Error deleting community action. Please try again.');
      }
    }
  };

  const handleView = (action) => {
    setViewingAction(action);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      actionType: 'AWARENESS_CAMP',
      targetAudience: 'ALL',
      district: '',
      panchayat: '',
      venue: '',
      actionDate: '',
      durationHours: '',
      maxParticipants: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      registrationRequired: false,
      registrationDeadline: '',
      isActive: true,
      isFeatured: false
    });
    setEditingAction(null);
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionTypeColor = (type) => {
    const colors = {
      AWARENESS_CAMP: 'bg-blue-100 text-blue-800',
      SKILL_DEVELOPMENT: 'bg-green-100 text-green-800',
      HEALTH_CHECKUP: 'bg-red-100 text-red-800',
      DIGITAL_LITERACY: 'bg-purple-100 text-purple-800',
      FINANCIAL_LITERACY: 'bg-yellow-100 text-yellow-800',
      WOMEN_EMPOWERMENT: 'bg-pink-100 text-pink-800',
      YOUTH_PROGRAM: 'bg-indigo-100 text-indigo-800',
      SENIOR_CITIZEN_CARE: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Community Actions Management
            </h1>
            <p className="text-gray-600">
              Manage community programs, workshops, and activities
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Action</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Actions</p>
                <p className="text-2xl font-bold text-gray-900">{actions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Actions</p>
                <p className="text-2xl font-bold text-green-600">
                  {actions.filter(a => a.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Actions</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {actions.filter(a => a.isFeatured).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-purple-600">
                  {actions.reduce((sum, a) => sum + (a.currentParticipants || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Actions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Audience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
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
                {actions.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {action.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {action.description.substring(0, 80)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(action.actionType)}`}>
                          {action.actionType.replace('_', ' ')}
                        </span>
                        <br />
                        <span className="text-xs text-gray-600">
                          Target: {action.targetAudience}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{action.district}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(action.actionDate)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {action.currentParticipants || 0}
                      {action.maxParticipants && ` / ${action.maxParticipants}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          action.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {action.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {action.isFeatured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(action)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(action)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(action.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={resetForm}
          title={editingAction ? 'Edit Community Action' : 'Add New Community Action'}
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
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <select
                  value={formData.actionType}
                  onChange={(e) => setFormData({...formData, actionType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="AWARENESS_CAMP">Awareness Camp</option>
                  <option value="SKILL_DEVELOPMENT">Skill Development</option>
                  <option value="HEALTH_CHECKUP">Health Checkup</option>
                  <option value="VACCINATION_DRIVE">Vaccination Drive</option>
                  <option value="DIGITAL_LITERACY">Digital Literacy</option>
                  <option value="FINANCIAL_LITERACY">Financial Literacy</option>
                  <option value="WOMEN_EMPOWERMENT">Women Empowerment</option>
                  <option value="YOUTH_PROGRAM">Youth Program</option>
                  <option value="SENIOR_CITIZEN_CARE">Senior Citizen Care</option>
                  <option value="ENVIRONMENTAL_INITIATIVE">Environmental Initiative</option>
                  <option value="CULTURAL_EVENT">Cultural Event</option>
                  <option value="SPORTS_ACTIVITY">Sports Activity</option>
                  <option value="COMMUNITY_MEETING">Community Meeting</option>
                  <option value="GRIEVANCE_REDRESSAL">Grievance Redressal</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">All Citizens</option>
                  <option value="WOMEN">Women</option>
                  <option value="YOUTH">Youth</option>
                  <option value="SENIOR_CITIZENS">Senior Citizens</option>
                  <option value="CHILDREN">Children</option>
                  <option value="FARMERS">Farmers</option>
                  <option value="ENTREPRENEURS">Entrepreneurs</option>
                  <option value="STUDENTS">Students</option>
                  <option value="DISABLED_PERSONS">Disabled Persons</option>
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
                  <option value="">Select District</option>
                  {DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panchayat
                </label>
                <input
                  type="text"
                  value={formData.panchayat}
                  onChange={(e) => setFormData({...formData, panchayat: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.actionDate}
                  onChange={(e) => setFormData({...formData, actionDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  value={formData.durationHours}
                  onChange={(e) => setFormData({...formData, durationHours: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="registrationRequired"
                  checked={formData.registrationRequired}
                  onChange={(e) => setFormData({...formData, registrationRequired: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="registrationRequired" className="ml-2 block text-sm text-gray-900">
                  Registration Required
                </label>
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
                  Active
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Featured
                </label>
              </div>
            </div>

            {formData.registrationRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAction ? 'Update Action' : 'Create Action'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={!!viewingAction}
          onClose={() => setViewingAction(null)}
          title="Community Action Details"
        >
          {viewingAction && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {viewingAction.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionTypeColor(viewingAction.actionType)}`}>
                    {viewingAction.actionType.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    Target: {viewingAction.targetAudience}
                  </span>
                  <span className="text-sm text-gray-500">
                    Participants: {viewingAction.currentParticipants || 0}
                    {viewingAction.maxParticipants && ` / ${viewingAction.maxParticipants}`}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-700">{viewingAction.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {viewingAction.actionDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(viewingAction.actionDate)}</span>
                  </div>
                )}

                {viewingAction.durationHours && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{viewingAction.durationHours} hours</span>
                  </div>
                )}

                {viewingAction.venue && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{viewingAction.venue}</span>
                  </div>
                )}

                {viewingAction.contactPerson && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{viewingAction.contactPerson}</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500 pt-4 border-t">
                <p>Created: {formatDate(viewingAction.createdAt)}</p>
                <p>Updated: {formatDate(viewingAction.updatedAt)}</p>
                <p>Registration Required: {viewingAction.registrationRequired ? 'Yes' : 'No'}</p>
                {viewingAction.registrationDeadline && (
                  <p>Registration Deadline: {formatDate(viewingAction.registrationDeadline)}</p>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminEvents;