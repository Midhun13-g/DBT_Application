// DEPRECATED: Use socketService.js instead
console.warn('realtimeSocketService.js is deprecated. Use socketService.js instead.');

export default {
  initialize: () => Promise.reject(new Error('Use socketService.js')),
  connect: () => Promise.reject(new Error('Use socketService.js')),
  disconnect: () => {},
  subscribe: () => () => {},
  send: () => {},
  isConnected: () => false,
  broadcastNoticeUpdate: () => {},
  broadcastContentUpdate: () => {},
  broadcastEventUpdate: () => {}
};