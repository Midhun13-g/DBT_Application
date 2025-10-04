// Global data that all components can access
window.globalNotices = [
  {
    id: 1,
    title: 'System Notice',
    content: 'This is a test notice to verify the system works',
    priority: 'HIGH',
    district: 'Delhi',
    isActive: true,
    createdAt: new Date().toISOString(),
    author: 'System'
  }
];

window.globalEvents = [
  {
    id: 1,
    title: 'System Event',
    description: 'This is a test event to verify the system works',
    actionType: 'DIGITAL_LITERACY',
    targetAudience: 'ALL',
    district: 'Delhi',
    venue: 'Community Center',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Helper functions
window.addNotice = (notice) => {
  const newNotice = {
    ...notice,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    author: 'Admin'
  };
  window.globalNotices.unshift(newNotice);
  window.dispatchEvent(new CustomEvent('dataUpdated'));
  return newNotice;
};

window.deleteNotice = (id) => {
  window.globalNotices = window.globalNotices.filter(n => n.id !== id);
  window.dispatchEvent(new CustomEvent('dataUpdated'));
};

window.addEvent = (event) => {
  const newEvent = {
    ...event,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    currentParticipants: 0
  };
  window.globalEvents.unshift(newEvent);
  window.dispatchEvent(new CustomEvent('dataUpdated'));
  return newEvent;
};

window.deleteEvent = (id) => {
  window.globalEvents = window.globalEvents.filter(e => e.id !== id);
  window.dispatchEvent(new CustomEvent('dataUpdated'));
};