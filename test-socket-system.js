// Socket System Test Script
// Run this in browser console to test the socket system

console.log('🧪 TESTING SOCKET SYSTEM');

// Test 1: Check if socket server is running
fetch('http://localhost:3001/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Socket server health:', data);
  })
  .catch(error => {
    console.log('❌ Socket server not running:', error.message);
    console.log('💡 Start server with: npm start (in root directory)');
  });

// Test 2: Check localStorage data
console.log('\n📚 CHECKING STORED DATA:');
const notices = JSON.parse(localStorage.getItem('notices') || '[]');
const awareness = JSON.parse(localStorage.getItem('awarenessContent') || '[]');

console.log('📢 Notices:', notices.length, 'total');
console.log('📚 Awareness:', awareness.length, 'total');

if (notices.length === 0) {
  console.log('💡 Add some notices from Admin Notice Board');
}

if (awareness.length === 0) {
  console.log('💡 Add some content from Admin Awareness Management');
}

// Test 3: Check if socketService is available
if (window.socketService) {
  console.log('\n🔌 SOCKET SERVICE STATUS:');
  console.log('Connected:', window.socketService.isConnected());
} else {
  console.log('\n⚠️ socketService not available in window');
  console.log('💡 Import it in your component: import socketService from "services/socketService"');
}

// Test 4: Simulate real-time update
console.log('\n🧪 SIMULATING REAL-TIME UPDATE:');
window.dispatchEvent(new CustomEvent('noticeUpdate', {
  detail: {
    type: 'NOTICE_CREATED',
    notice: { id: 999, title: 'Test Notice', content: 'This is a test' },
    timestamp: new Date().toISOString()
  }
}));

window.dispatchEvent(new CustomEvent('contentUpdate', {
  detail: {
    type: 'CONTENT_CREATED',
    content: { id: 999, title: 'Test Content', content: 'This is test content' },
    timestamp: new Date().toISOString()
  }
}));

console.log('✅ Test events dispatched - check if components respond');

console.log('\n📋 SUMMARY:');
console.log('1. Socket server should be running on port 3001');
console.log('2. Admin components should show connection status');
console.log('3. User components should receive real-time updates');
console.log('4. All data should be stored in localStorage consistently');