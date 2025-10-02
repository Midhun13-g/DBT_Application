import api from './api';

const COMMUNITY_ACTION_STORAGE_KEY = 'communityActions';

class CommunityActionService {
  // Get all actions from localStorage
  getActionsFromStorage() {
    try {
      const actions = localStorage.getItem(COMMUNITY_ACTION_STORAGE_KEY);
      return actions ? JSON.parse(actions) : [];
    } catch (error) {
      console.error('Error reading community actions from localStorage:', error);
      return [];
    }
  }

  // Save actions to localStorage
  saveActionsToStorage(actions) {
    try {
      localStorage.setItem(COMMUNITY_ACTION_STORAGE_KEY, JSON.stringify(actions));
      return true;
    } catch (error) {
      console.error('Error saving community actions to localStorage:', error);
      return false;
    }
  }

  // Get all actions (with API fallback)
  async getAllActions(params = {}) {
    try {
      const response = await api.get('/community-actions', { params });
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      const actions = this.getActionsFromStorage();
      return {
        data: {
          content: actions,
          totalElements: actions.length,
          totalPages: 1,
          number: 0,
          size: actions.length
        }
      };
    }
  }

  // Create a new action
  async createAction(actionData) {
    try {
      const response = await api.post('/community-actions', actionData);
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      const actions = this.getActionsFromStorage();
      const newAction = {
        ...actionData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentParticipants: 0
      };
      actions.unshift(newAction);
      this.saveActionsToStorage(actions);
      return { data: newAction };
    }
  }

  // Update an action
  async updateAction(id, actionData) {
    try {
      const response = await api.put(`/community-actions/${id}`, actionData);
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      const actions = this.getActionsFromStorage();
      const index = actions.findIndex(action => action.id === id);
      if (index !== -1) {
        actions[index] = {
          ...actions[index],
          ...actionData,
          updatedAt: new Date().toISOString()
        };
        this.saveActionsToStorage(actions);
        return { data: actions[index] };
      }
      throw new Error('Community Action not found');
    }
  }

  // Delete an action
  async deleteAction(id) {
    try {
      const response = await api.delete(`/community-actions/${id}`);
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      const actions = this.getActionsFromStorage();
      const filteredActions = actions.filter(action => action.id !== id);
      this.saveActionsToStorage(filteredActions);
      return { data: { success: true } };
    }
  }

  // Register participant
  async registerParticipant(id) {
    try {
      const response = await api.post(`/community-actions/${id}/register`);
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      const actions = this.getActionsFromStorage();
      const index = actions.findIndex(action => action.id === id);
      if (index !== -1) {
        const action = actions[index];
        if (action.maxParticipants && action.currentParticipants >= action.maxParticipants) {
          throw new Error('Maximum participants reached');
        }
        actions[index].currentParticipants = (actions[index].currentParticipants || 0) + 1;
        this.saveActionsToStorage(actions);
        return { data: actions[index] };
      }
      throw new Error('Community Action not found');
    }
  }

  // Initialize with dummy data
  initializeDummyData() {
    const existingActions = this.getActionsFromStorage();
    if (existingActions.length === 0) {
      const dummyActions = [
        {
          id: 1,
          title: 'Digital Literacy Workshop for Women',
          description: 'Learn smartphone usage, online banking, and digital payments. Free training with certificates provided.',
          actionType: 'DIGITAL_LITERACY',
          targetAudience: 'WOMEN',
          district: 'Delhi',
          panchayat: 'Central Delhi Panchayat',
          venue: 'Community Hall, Connaught Place',
          actionDate: '2024-02-10T10:00:00',
          durationHours: 4,
          maxParticipants: 50,
          currentParticipants: 23,
          contactPerson: 'Sunita Sharma',
          contactPhone: '+91-9876543210',
          contactEmail: 'sunita@delhipanchayat.gov.in',
          registrationRequired: true,
          registrationDeadline: '2024-02-08T23:59:00',
          isActive: true,
          isFeatured: true,
          createdAt: '2024-01-20T09:00:00',
          updatedAt: '2024-01-22T14:30:00'
        },
        {
          id: 2,
          title: 'Health Checkup Camp',
          description: 'Free health screening including blood pressure, diabetes, and general health checkup for all age groups.',
          actionType: 'HEALTH_CHECKUP',
          targetAudience: 'ALL',
          district: 'Mumbai',
          panchayat: 'Andheri Panchayat',
          venue: 'Primary Health Center, Andheri',
          actionDate: '2024-02-15T08:00:00',
          durationHours: 8,
          maxParticipants: 200,
          currentParticipants: 87,
          contactPerson: 'Dr. Rajesh Kumar',
          contactPhone: '+91-9876543211',
          contactEmail: 'rajesh@mumbaipanchayat.gov.in',
          registrationRequired: false,
          isActive: true,
          isFeatured: false,
          createdAt: '2024-01-18T11:15:00',
          updatedAt: '2024-01-18T11:15:00'
        },
        {
          id: 3,
          title: 'Skill Development Program for Youth',
          description: 'Learn computer skills, communication, and job interview techniques. Placement assistance provided.',
          actionType: 'SKILL_DEVELOPMENT',
          targetAudience: 'YOUTH',
          district: 'Bangalore',
          panchayat: 'Electronic City Panchayat',
          venue: 'Skill Development Center',
          actionDate: '2024-02-20T09:00:00',
          durationHours: 6,
          maxParticipants: 30,
          currentParticipants: 15,
          contactPerson: 'Priya Nair',
          contactPhone: '+91-9876543212',
          contactEmail: 'priya@bangalorepanchayat.gov.in',
          registrationRequired: true,
          registrationDeadline: '2024-02-18T17:00:00',
          isActive: true,
          isFeatured: true,
          createdAt: '2024-01-25T16:45:00',
          updatedAt: '2024-01-25T16:45:00'
        },
        {
          id: 4,
          title: 'Financial Literacy for Farmers',
          description: 'Understanding banking, loans, insurance, and government schemes for agricultural development.',
          actionType: 'FINANCIAL_LITERACY',
          targetAudience: 'FARMERS',
          district: 'Chennai',
          panchayat: 'Tambaram Panchayat',
          venue: 'Agricultural Extension Center',
          actionDate: '2024-02-25T14:00:00',
          durationHours: 3,
          maxParticipants: 100,
          currentParticipants: 45,
          contactPerson: 'Murugan Selvam',
          contactPhone: '+91-9876543213',
          contactEmail: 'murugan@chennaipanchayat.gov.in',
          registrationRequired: false,
          isActive: true,
          isFeatured: false,
          createdAt: '2024-01-15T10:30:00',
          updatedAt: '2024-01-20T12:00:00'
        },
        {
          id: 5,
          title: 'Senior Citizen Care Program',
          description: 'Health awareness, yoga sessions, and social activities for senior citizens. Regular monthly program.',
          actionType: 'SENIOR_CITIZEN_CARE',
          targetAudience: 'SENIOR_CITIZENS',
          district: 'Pune',
          panchayat: 'Kothrud Panchayat',
          venue: 'Senior Citizen Center',
          actionDate: '2024-03-01T16:00:00',
          durationHours: 2,
          maxParticipants: 40,
          currentParticipants: 28,
          contactPerson: 'Asha Patil',
          contactPhone: '+91-9876543214',
          contactEmail: 'asha@punepanchayat.gov.in',
          registrationRequired: true,
          registrationDeadline: '2024-02-28T12:00:00',
          isActive: true,
          isFeatured: false,
          createdAt: '2024-01-22T08:00:00',
          updatedAt: '2024-01-23T10:15:00'
        }
      ];
      this.saveActionsToStorage(dummyActions);
      return dummyActions;
    }
    return existingActions;
  }
}

export default new CommunityActionService();