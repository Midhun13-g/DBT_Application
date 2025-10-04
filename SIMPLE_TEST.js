// Simple test to verify notice system
// Run this in browser console

console.log('🧪 SIMPLE NOTICE SYSTEM TEST');

// Clear existing data
localStorage.removeItem('notices');
console.log('🗑️ Cleared existing notices');

// Create a test notice exactly like admin would
const testNotice = {
  id: Date.now(),
  title: 'Test Notice Title',
  content: 'This is the test notice content that should be visible',
  priority: 'MEDIUM',
  district: 'Test District',
  author: 'Test Admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

console.log('📝 Created test notice:', testNotice);

// Save to localStorage
localStorage.setItem('notices', JSON.stringify([testNotice]));
console.log('💾 Saved to localStorage');

// Verify storage
const stored = JSON.parse(localStorage.getItem('notices') || '[]');
console.log('📚 Stored notices:', stored);

// Test user filtering
const activeNotices = stored.filter(n => n.isActive === true);
console.log('✅ Active notices (what user should see):', activeNotices);

// Trigger page refresh
console.log('🔄 Now refresh the user NoticeBoard page to see the notice');

// Also trigger real-time update
window.dispatchEvent(new CustomEvent('noticeUpdate', {
  detail: {
    type: 'NOTICE_CREATED',
    notice: testNotice,
    timestamp: new Date().toISOString()
  }
}));

console.log('✅ Test complete - check user page now');