import api from './api';
import eventBus from './eventBus';

const NOTICE_STORAGE_KEY = 'noticeBoard';

class NoticeService {
  // Get all notices from localStorage
  getNoticesFromStorage() {
    try {
      const notices = localStorage.getItem(NOTICE_STORAGE_KEY);
      return notices ? JSON.parse(notices) : [];
    } catch (error) {
      console.error('Error reading notices from localStorage:', error);
      return [];
    }
  }

  // Save notices to localStorage and emit update
  saveNoticesToStorage(notices) {
    try {
      localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(notices));
      // Emit real-time update
      eventBus.emit('notices-updated', notices);
      return true;
    } catch (error) {
      console.error('Error saving notices to localStorage:', error);
      return false;
    }
  }

  // Get all notices (with API fallback)
  async getAllNotices(params = {}) {
    try {
      // Try to get from API first
      const response = await api.get('/notices', { params });
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      // Fallback to localStorage
      const notices = this.getNoticesFromStorage();
      return {
        data: {
          content: notices,
          totalElements: notices.length,
          totalPages: 1,
          number: 0,
          size: notices.length
        }
      };
    }
  }

  // Create a new notice
  async createNotice(noticeData) {
    try {
      // Try API first
      const response = await api.post('/notices', noticeData);
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      // Fallback to localStorage
      const notices = this.getNoticesFromStorage();
      const newNotice = {
        ...noticeData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        author: 'Admin User'
      };
      notices.unshift(newNotice);
      this.saveNoticesToStorage(notices);
      return { data: newNotice };
    }
  }

  // Update a notice
  async updateNotice(id, noticeData) {
    try {
      // Try API first
      const response = await api.put(`/notices/${id}`, noticeData);
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      // Fallback to localStorage
      const notices = this.getNoticesFromStorage();
      const index = notices.findIndex(notice => notice.id === id);
      if (index !== -1) {
        notices[index] = {
          ...notices[index],
          ...noticeData,
          updatedAt: new Date().toISOString()
        };
        this.saveNoticesToStorage(notices);
        return { data: notices[index] };
      }
      throw new Error('Notice not found');
    }
  }

  // Delete a notice
  async deleteNotice(id) {
    try {
      // Try API first
      const response = await api.delete(`/notices/${id}`);
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      // Fallback to localStorage
      const notices = this.getNoticesFromStorage();
      const filteredNotices = notices.filter(notice => notice.id !== id);
      this.saveNoticesToStorage(filteredNotices);
      return { data: { success: true } };
    }
  }

  // Get notice by ID
  async getNoticeById(id) {
    try {
      // Try API first
      const response = await api.get(`/notices/${id}`);
      return response;
    } catch (error) {
      console.warn('API not available, using localStorage:', error.message);
      // Fallback to localStorage
      const notices = this.getNoticesFromStorage();
      const notice = notices.find(notice => notice.id === id);
      if (notice) {
        return { data: notice };
      }
      throw new Error('Notice not found');
    }
  }

  // Convert admin notice format to community format
  convertToCommunitFormat(adminNotices) {
    return adminNotices
      .filter(notice => notice.isActive)
      .map(notice => ({
        id: notice.id,
        title: notice.title,
        description: notice.content,
        type: notice.type.toLowerCase(),
        priority: notice.priority.toLowerCase(),
        district: notice.district || 'All Districts',
        panchayat: `${notice.district || 'All'} Panchayat`,
        date: notice.eventDate ? notice.eventDate.split('T')[0] : '',
        time: notice.eventDate ? new Date(notice.eventDate).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '',
        venue: 'Community Center',
        contactPerson: 'Panchayat Officer',
        contactPhone: '+91-9876543210',
        contactEmail: 'info@panchayat.gov.in',
        targetAudience: 'all',
        tags: [notice.type, 'DBT', 'Government'],
        attachments: [],
        views: notice.views || 0,
        likes: Math.floor(Math.random() * 100) + 50,
        bookmarks: Math.floor(Math.random() * 200) + 100,
        comments: [
          { 
            user: 'Citizen User', 
            comment: 'Very informative notice!', 
            date: new Date().toISOString().split('T')[0] 
          }
        ],
        status: 'active',
        featured: notice.priority === 'URGENT' || notice.priority === 'HIGH',
        createdAt: notice.createdAt,
        updatedAt: notice.updatedAt,
        author: notice.author || 'Government Office',
        authorRole: 'government_official'
      }));
  }

  // Get notices for community view
  getNoticesForCommunity() {
    const adminNotices = this.getNoticesFromStorage();
    return this.convertToCommunitFormat(adminNotices);
  }

  // Initialize with dummy data if empty
  initializeDummyData() {
    const existingNotices = this.getNoticesFromStorage();
    if (existingNotices.length === 0) {
      const dummyNotices = [
        {
          id: 1,
          title: 'Aadhaar Seeding Camp - Delhi Central',
          content: 'Free Aadhaar seeding camp for all bank account holders. Bring your Aadhaar card and bank passbook. Expert assistance available for all major banks including SBI, HDFC, ICICI, and others.',
          type: 'CAMP',
          priority: 'HIGH',
          district: 'Delhi',
          eventDate: '2024-02-15T10:00:00',
          attachmentUrl: '',
          isActive: true,
          createdAt: '2024-01-20T09:00:00',
          updatedAt: '2024-01-22T14:30:00',
          views: 1250,
          author: 'Delhi Panchayat Office'
        },
        {
          id: 2,
          title: 'DBT Workshop for Senior Citizens',
          content: 'Special workshop designed for senior citizens to understand Direct Benefit Transfer system. Free registration and refreshments provided. Volunteers available for assistance.',
          type: 'WORKSHOP',
          priority: 'MEDIUM',
          district: 'Mumbai',
          eventDate: '2024-02-20T14:00:00',
          attachmentUrl: '',
          isActive: true,
          createdAt: '2024-01-18T11:15:00',
          updatedAt: '2024-01-18T11:15:00',
          views: 890,
          author: 'Mumbai Municipal Corporation'
        },
        {
          id: 3,
          title: 'Scholarship Application Deadline Extended',
          content: 'The deadline for scholarship applications under PM-YASASVI scheme has been extended to March 15, 2024. Students can apply online through the official portal.',
          type: 'DEADLINE',
          priority: 'URGENT',
          district: 'All Districts',
          eventDate: '2024-03-15T23:59:00',
          attachmentUrl: '',
          isActive: true,
          createdAt: '2024-01-25T16:45:00',
          updatedAt: '2024-01-25T16:45:00',
          views: 2100,
          author: 'Ministry of Education'
        },
        {
          id: 4,
          title: 'Digital Literacy Program Launch',
          content: 'New digital literacy program for rural areas. Free training on smartphone usage, online banking, and government services. Registration starts from February 1st.',
          type: 'EVENT',
          priority: 'MEDIUM',
          district: 'Bangalore',
          eventDate: '2024-02-01T09:00:00',
          attachmentUrl: '',
          isActive: true,
          createdAt: '2024-01-15T10:30:00',
          updatedAt: '2024-01-20T12:00:00',
          views: 675,
          author: 'Karnataka IT Department'
        },
        {
          id: 5,
          title: 'Bank Account Verification Drive',
          content: 'Mandatory verification of bank accounts linked with Aadhaar. Citizens are requested to visit their respective bank branches with original documents.',
          type: 'GENERAL',
          priority: 'HIGH',
          district: 'Chennai',
          eventDate: '',
          attachmentUrl: '',
          isActive: true,
          createdAt: '2024-01-22T08:00:00',
          updatedAt: '2024-01-23T10:15:00',
          views: 1450,
          author: 'Reserve Bank of India'
        }
      ];
      this.saveNoticesToStorage(dummyNotices);
      return dummyNotices;
    }
    return existingNotices;
  }
}

export default new NoticeService();