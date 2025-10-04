class ContentSyncService {
  constructor() {
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Save content with automatic sync
  saveContent(content, type = 'awareness') {
    const timestamp = new Date().toISOString();
    const contentWithMeta = {
      ...content,
      lastModified: timestamp,
      syncStatus: this.isOnline ? 'synced' : 'pending'
    };

    // Save to localStorage
    const storageKey = type === 'awareness' ? 'awarenessContent' : 'notices';
    const existingContent = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (content.id) {
      // Update existing
      const index = existingContent.findIndex(item => item.id === content.id);
      if (index !== -1) {
        existingContent[index] = contentWithMeta;
      }
    } else {
      // Add new
      contentWithMeta.id = Date.now();
      existingContent.unshift(contentWithMeta);
    }

    localStorage.setItem(storageKey, JSON.stringify(existingContent));

    // Add to sync queue if offline
    if (!this.isOnline) {
      this.syncQueue.push({
        action: content.id ? 'update' : 'create',
        type,
        content: contentWithMeta,
        timestamp
      });
    }

    return contentWithMeta;
  }

  // Get content with sync status
  getContent(type = 'awareness', activeOnly = false) {
    const storageKey = type === 'awareness' ? 'awarenessContent' : 'notices';
    const content = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (activeOnly) {
      return content.filter(item => item.isActive);
    }
    
    return content;
  }

  // Process sync queue when back online
  async processSyncQueue() {
    if (this.syncQueue.length === 0) return;

    console.log(`🔄 Processing ${this.syncQueue.length} queued sync operations`);

    for (const operation of this.syncQueue) {
      try {
        // Here you would normally sync with backend API
        console.log('✅ Synced:', operation.action, operation.type);
        
        // Update sync status in localStorage
        this.updateSyncStatus(operation.content.id, operation.type, 'synced');
      } catch (error) {
        console.error('❌ Sync failed:', error);
        this.updateSyncStatus(operation.content.id, operation.type, 'failed');
      }
    }

    this.syncQueue = [];
  }

  updateSyncStatus(contentId, type, status) {
    const storageKey = type === 'awareness' ? 'awarenessContent' : 'notices';
    const content = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const index = content.findIndex(item => item.id === contentId);
    
    if (index !== -1) {
      content[index].syncStatus = status;
      localStorage.setItem(storageKey, JSON.stringify(content));
    }
  }

  // Force sync all content
  async syncAll() {
    const awarenessContent = this.getContent('awareness');
    const notices = this.getContent('notices');

    console.log(`🔄 Force syncing ${awarenessContent.length} awareness items and ${notices.length} notices`);

    // Mark all as synced (in real app, would sync with backend)
    awarenessContent.forEach(item => {
      this.updateSyncStatus(item.id, 'awareness', 'synced');
    });

    notices.forEach(item => {
      this.updateSyncStatus(item.id, 'notices', 'synced');
    });

    console.log('✅ All content synced');
  }

  // Get sync statistics
  getSyncStats() {
    const awarenessContent = this.getContent('awareness');
    const notices = this.getContent('notices');
    
    const stats = {
      total: awarenessContent.length + notices.length,
      synced: 0,
      pending: 0,
      failed: 0
    };

    [...awarenessContent, ...notices].forEach(item => {
      const status = item.syncStatus || 'synced';
      stats[status]++;
    });

    return stats;
  }
}

export default new ContentSyncService();