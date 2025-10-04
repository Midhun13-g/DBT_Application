const API_BASE = 'http://localhost:8080/api/data';

class DataService {
  async saveToCache(type, data) {
    try {
      const response = await fetch(`${API_BASE}/save/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      return false;
    }
  }

  async loadFromCache(type) {
    try {
      const response = await fetch(`${API_BASE}/load/${type}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
    }
    return null;
  }

  async dataExists(type) {
    try {
      const response = await fetch(`${API_BASE}/exists/${type}`);
      return response.ok ? await response.json() : false;
    } catch (error) {
      console.error(`Error checking ${type}:`, error);
      return false;
    }
  }

  async saveData(type, data) {
    localStorage.setItem(type, JSON.stringify(data));
    await this.saveToCache(type, data);
  }

  async loadData(type, defaultData = []) {
    // Try cache first
    const cached = await this.loadFromCache(type);
    if (cached) {
      localStorage.setItem(type, JSON.stringify(cached));
      return cached;
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem(type);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error(`Error parsing ${type}:`, error);
      }
    }
    
    // Initialize with default data
    if (defaultData.length > 0) {
      await this.saveData(type, defaultData);
      return defaultData;
    }
    
    return [];
  }
}

export default new DataService();