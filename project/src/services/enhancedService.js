import { apiService } from './api';

class EnhancedService {
  // Notice Board Services
  async getNotices(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiService.get(`/notices?${params.toString()}`);
  }

  async createNotice(notice) {
    return apiService.post('/notices', notice);
  }

  async updateNotice(id, notice) {
    return apiService.put(`/notices/${id}`, notice);
  }

  async deleteNotice(id) {
    return apiService.delete(`/notices/${id}`);
  }

  // School Activities Services
  async getSchoolActivities(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiService.get(`/school-activities?${params.toString()}`);
  }

  async createSchoolActivity(activity) {
    return apiService.post('/school-activities', activity);
  }

  async registerForActivity(activityId, registrationData) {
    return apiService.post(`/school-activities/${activityId}/register`, registrationData);
  }

  // Knowledge Hub Services
  async getKnowledgeContent(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiService.get(`/knowledge-hub?${params.toString()}`);
  }

  async incrementViewCount(contentId) {
    return apiService.put(`/knowledge-hub/${contentId}/view`);
  }

  async createKnowledgeContent(content) {
    return apiService.post('/knowledge-hub', content);
  }

  // Scholarship Services
  async getUserScholarships(userId) {
    return apiService.get(`/scholarships/user/${userId}`);
  }

  async checkScholarshipStatus(applicationId, aadhaarLast4) {
    return apiService.post('/scholarships/check', {
      applicationId,
      aadhaarLast4
    });
  }

  async createScholarshipStatus(status) {
    return apiService.post('/scholarships', status);
  }

  // User Progress Services
  async getUserProgress(userId) {
    return apiService.get(`/user-progress/${userId}`);
  }

  async updateUserProgress(userId, contentId, progressData) {
    return apiService.put(`/user-progress/${userId}/${contentId}`, progressData);
  }
}

export const enhancedService = new EnhancedService();