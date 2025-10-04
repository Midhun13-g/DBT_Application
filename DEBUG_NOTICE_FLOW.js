// Debug script to test notice data flow
// Run this in browser console

console.log('🔍 DEBUGGING NOTICE DATA FLOW');

// Step 1: Check current localStorage
const currentNotices = JSON.parse(localStorage.getItem('notices') || '[]');
console.log('📚 Current notices in localStorage:', currentNotices);

// Step 2: Create a test notice manually
const testNotice = {
  id: Date.now(),
  title: 'Test Notice',
  content: 'This is a test notice to verify data flow',
  priority: 'MEDIUM',
  district: 'Test District',
  author: 'Test Admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

console.log('🧪 Creating test notice:', testNotice);

// Step 3: Add to localStorage
const updatedNotices = [testNotice, ...currentNotices];
localStorage.setItem('notices', JSON.stringify(updatedNotices));

console.log('💾 Saved to localStorage. Total notices:', updatedNotices.length);

// Step 4: Verify what user page would see
const activeNotices = updatedNotices.filter(n => n.isActive);
console.log('✅ Active notices (what user sees):', activeNotices);

// Step 5: Check if any notices are missing isActive property
const missingActive = updatedNotices.filter(n => n.isActive === undefined);
if (missingActive.length > 0) {
  console.log('⚠️ Notices missing isActive property:', missingActive);
} else {
  console.log('✅ All notices have isActive property');
}

// Step 6: Trigger a manual refresh on user page
console.log('🔄 Triggering manual refresh...');
window.dispatchEvent(new CustomEvent('noticeUpdate', {
  detail: {
    type: 'NOTICE_CREATED',
    notice: testNotice,
    timestamp: new Date().toISOString()
  }
}));

console.log('✅ Debug complete. Check if user page shows the notices now.');