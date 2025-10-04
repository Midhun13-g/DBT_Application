// Test real-time socket connection
// Run this in browser console

console.log('🧪 TESTING REAL-TIME SOCKET CONNECTION');

// Test 1: Check if socketService is available
if (window.socketService) {
  console.log('✅ socketService available in window');
} else {
  console.log('❌ socketService not in window - importing...');
  // Try to access it through the module system
  import('/src/services/socketService.js').then(module => {
    window.socketService = module.default;
    console.log('✅ socketService imported');
  }).catch(err => {
    console.log('❌ Failed to import socketService:', err);
  });
}

// Test 2: Manual socket connection test
const testSocket = io('http://localhost:3001');

testSocket.on('connect', () => {
  console.log('✅ Manual socket connected');
  
  // Register as test user
  testSocket.emit('user_register', {
    userId: 'test-user',
    role: 'user',
    name: 'Test User'
  });
  
  // Listen for updates
  testSocket.on('notice_update', (data) => {
    console.log('📢 Received notice update via manual socket:', data);
  });
  
  // Test sending update
  testSocket.emit('admin_notice_update', {
    type: 'NOTICE_CREATED',
    notice: { id: 999, title: 'Test Notice', content: 'Test Content' },
    timestamp: new Date().toISOString()
  });
  
  console.log('📤 Sent test notice update');
});

testSocket.on('connect_error', (error) => {
  console.log('❌ Manual socket connection failed:', error);
});

// Test 3: Check localStorage sync
console.log('\n📚 CURRENT NOTICES IN STORAGE:');
const notices = JSON.parse(localStorage.getItem('notices') || '[]');
console.log('Total notices:', notices.length);
console.log('Active notices:', notices.filter(n => n.isActive).length);

// Test 4: Simulate admin adding notice
console.log('\n🔧 SIMULATING ADMIN ADDING NOTICE:');
const newNotice = {
  id: Date.now(),
  title: 'Real-time Test Notice',
  content: 'This notice tests real-time sync',
  priority: 'HIGH',
  district: 'Test',
  author: 'Test Admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const updatedNotices = [newNotice, ...notices];
localStorage.setItem('notices', JSON.stringify(updatedNotices));

// Trigger real-time update
window.dispatchEvent(new CustomEvent('noticeUpdate', {
  detail: {
    type: 'NOTICE_CREATED',
    notice: newNotice,
    timestamp: new Date().toISOString()
  }
}));

console.log('✅ Added notice and triggered update event');
console.log('🔄 Check if user page updates automatically');