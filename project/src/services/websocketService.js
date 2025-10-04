// DEPRECATED: Use socketService.js instead
console.warn('websocketService.js is deprecated. Use socketService.js instead.');

export default {
  connect: () => Promise.reject(new Error('Use socketService.js')),
  disconnect: () => {},
  subscribe: () => () => {},
  send: () => {},
  isConnected: () => false
};