import simpleRealtimeService from './simpleRealtimeService';
import noticeService from './noticeService';
import communityActionService from './communityActionService';
import eventBus from './eventBus';

class RealtimeManager {
  constructor() {
    this.data = {
      NOTICES: [],
      COMMUNITY_ACTIONS: []
    };
    this.subscribers = {
      NOTICES: new Set(),
      COMMUNITY_ACTIONS: new Set()
    };
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize simple real-time service
      await simpleRealtimeService.initialize();
      
      // Load initial data
      await this.loadInitialData();
      
      this.initialized = true;
      console.log('RealtimeManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RealtimeManager:', error);
      // Fallback to localStorage-only mode
      await this.loadInitialData();
      this.initialized = true;
    }
  }



  async loadInitialData() {
    // Load notices
    const notices = noticeService.getNoticesFromStorage();
    this.data.NOTICES = notices;
    
    // Load community actions
    const actions = communityActionService.getActionsFromStorage();
    this.data.COMMUNITY_ACTIONS = actions;
    
    // Initialize dummy data if empty
    if (notices.length === 0) {
      noticeService.initializeDummyData();
      this.data.NOTICES = noticeService.getNoticesFromStorage();
    }
    
    if (actions.length === 0) {
      communityActionService.initializeDummyData();
      this.data.COMMUNITY_ACTIONS = communityActionService.getActionsFromStorage();
    }
  }

  handleNoticeUpdate(message) {
    const { notice, action } = message;
    
    switch (action) {
      case 'CREATE':
        this.data.NOTICES.unshift(notice);
        break;
      case 'UPDATE':
        const updateIndex = this.data.NOTICES.findIndex(n => n.id === notice.id);
        if (updateIndex !== -1) {
          this.data.NOTICES[updateIndex] = notice;
        }
        break;
      case 'DELETE':
        this.data.NOTICES = this.data.NOTICES.filter(n => n.id !== notice.id);
        break;
    }
    
    // Update localStorage
    noticeService.saveNoticesToStorage(this.data.NOTICES);
    
    // Notify subscribers
    this.notifySubscribers('NOTICES');
  }

  handleCommunityActionUpdate(message) {
    const { communityAction, action } = message;
    
    switch (action) {
      case 'CREATE':
        this.data.COMMUNITY_ACTIONS.unshift(communityAction);
        break;
      case 'UPDATE':
      case 'REGISTER':
        const updateIndex = this.data.COMMUNITY_ACTIONS.findIndex(a => a.id === communityAction.id);
        if (updateIndex !== -1) {
          this.data.COMMUNITY_ACTIONS[updateIndex] = communityAction;
        }
        break;
      case 'DELETE':
        this.data.COMMUNITY_ACTIONS = this.data.COMMUNITY_ACTIONS.filter(a => a.id !== communityAction.id);
        break;
    }
    
    // Update localStorage
    communityActionService.saveActionsToStorage(this.data.COMMUNITY_ACTIONS);
    
    // Notify subscribers
    this.notifySubscribers('COMMUNITY_ACTIONS');
  }

  async refreshNotices() {
    try {
      const notices = noticeService.getNoticesFromStorage();
      this.data.NOTICES = notices;
      this.notifySubscribers('NOTICES');
    } catch (error) {
      console.error('Failed to refresh notices:', error);
    }
  }

  async refreshCommunityActions() {
    try {
      const actions = communityActionService.getActionsFromStorage();
      this.data.COMMUNITY_ACTIONS = actions;
      this.notifySubscribers('COMMUNITY_ACTIONS');
    } catch (error) {
      console.error('Failed to refresh community actions:', error);
    }
  }

  // Notice management methods
  createNotice(noticeData) {
    const newNotice = {
      ...noticeData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      author: 'Admin User'
    };
    
    this.data.NOTICES.unshift(newNotice);
    noticeService.saveNoticesToStorage(this.data.NOTICES);
    this.notifySubscribers('NOTICES');
    
    return newNotice;
  }

  updateNotice(id, updateData) {
    const index = this.data.NOTICES.findIndex(notice => notice.id === id);
    if (index !== -1) {
      this.data.NOTICES[index] = {
        ...this.data.NOTICES[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      noticeService.saveNoticesToStorage(this.data.NOTICES);
      this.notifySubscribers('NOTICES');
      return this.data.NOTICES[index];
    }
    throw new Error('Notice not found');
  }

  deleteNotice(id) {
    this.data.NOTICES = this.data.NOTICES.filter(notice => notice.id !== id);
    noticeService.saveNoticesToStorage(this.data.NOTICES);
    this.notifySubscribers('NOTICES');
  }

  // Community action management methods
  createCommunityAction(actionData) {
    const newAction = {
      ...actionData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentParticipants: 0
    };
    
    this.data.COMMUNITY_ACTIONS.unshift(newAction);
    communityActionService.saveActionsToStorage(this.data.COMMUNITY_ACTIONS);
    this.notifySubscribers('COMMUNITY_ACTIONS');
    
    return newAction;
  }

  updateCommunityAction(id, updateData) {
    const index = this.data.COMMUNITY_ACTIONS.findIndex(action => action.id === id);
    if (index !== -1) {
      this.data.COMMUNITY_ACTIONS[index] = {
        ...this.data.COMMUNITY_ACTIONS[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      communityActionService.saveActionsToStorage(this.data.COMMUNITY_ACTIONS);
      this.notifySubscribers('COMMUNITY_ACTIONS');
      return this.data.COMMUNITY_ACTIONS[index];
    }
    throw new Error('Community Action not found');
  }

  deleteCommunityAction(id) {
    this.data.COMMUNITY_ACTIONS = this.data.COMMUNITY_ACTIONS.filter(action => action.id !== id);
    communityActionService.saveActionsToStorage(this.data.COMMUNITY_ACTIONS);
    this.notifySubscribers('COMMUNITY_ACTIONS');
  }

  // Subscription management
  subscribe(dataType, callback) {
    if (!this.subscribers[dataType]) {
      this.subscribers[dataType] = new Set();
    }
    
    this.subscribers[dataType].add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers[dataType].delete(callback);
    };
  }

  notifySubscribers(dataType) {
    if (this.subscribers[dataType]) {
      this.subscribers[dataType].forEach(callback => {
        try {
          callback(this.data[dataType]);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
    
    // Also emit through eventBus for backward compatibility
    if (dataType === 'NOTICES') {
      eventBus.emit('notices-updated', this.data.NOTICES);
    } else if (dataType === 'COMMUNITY_ACTIONS') {
      eventBus.emit('community-actions-updated', this.data.COMMUNITY_ACTIONS);
    }
  }

  // Data access methods
  getData(dataType) {
    return this.data[dataType] || [];
  }

  initializeData() {
    if (!this.initialized) {
      this.initialize();
    }
  }

  // Cleanup
  destroy() {
    simpleRealtimeService.disconnect();
    this.subscribers = {
      NOTICES: new Set(),
      COMMUNITY_ACTIONS: new Set()
    };
    this.initialized = false;
  }
}

export default new RealtimeManager();