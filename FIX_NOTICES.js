// Fix all notices to be active
// Run this in browser console

console.log('🔧 FIXING ALL NOTICES TO BE ACTIVE');

const stored = localStorage.getItem('notices');
if (stored) {
  const notices = JSON.parse(stored);
  console.log('📚 Found', notices.length, 'notices');
  
  // Check current active status
  notices.forEach((notice, index) => {
    console.log(`Notice ${index + 1}: "${notice.title}" - isActive: ${notice.isActive}`);
  });
  
  // Fix all notices to be active
  const fixedNotices = notices.map(notice => ({
    ...notice,
    isActive: true
  }));
  
  localStorage.setItem('notices', JSON.stringify(fixedNotices));
  console.log('✅ Fixed all notices to be active');
  
  // Verify fix
  const activeCount = fixedNotices.filter(n => n.isActive).length;
  console.log('✅ Now', activeCount, 'notices are active');
  
  // Trigger refresh
  window.dispatchEvent(new CustomEvent('noticeUpdate', {
    detail: { type: 'NOTICE_UPDATED', timestamp: new Date().toISOString() }
  }));
  
  console.log('🔄 Refresh the user page to see all notices');
} else {
  console.log('❌ No notices found');
}