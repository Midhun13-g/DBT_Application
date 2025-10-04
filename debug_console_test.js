// Copy and paste this in browser console to test linking

console.log('🔍 TESTING NOTICE BOARD LINKING');

// Clear existing data
localStorage.removeItem('notices');
localStorage.removeItem('events');
console.log('🧹 Cleared existing data');

// Test 1: Admin Notice Board → User Notice Board
console.log('\n📝 TEST 1: NOTICE BOARD LINKING');

// Simulate admin adding a notice
const adminNotices = [];
const newNotice = {
    id: Date.now(),
    title: 'Console Test Notice',
    content: 'This notice was added via console to test linking',
    type: 'GENERAL',
    priority: 'HIGH',
    district: 'Delhi',
    isActive: true,
    createdAt: new Date().toISOString(),
    author: 'Console Admin'
};
adminNotices.push(newNotice);
localStorage.setItem('notices', JSON.stringify(adminNotices));
console.log('✅ Admin saved notice to localStorage["notices"]');
console.log('📊 Admin data:', adminNotices);

// Simulate user reading notices
const userNotices = JSON.parse(localStorage.getItem('notices') || '[]');
const activeUserNotices = userNotices.filter(notice => notice.isActive);
console.log('✅ User read from localStorage["notices"]');
console.log('📊 User sees:', activeUserNotices.length, 'active notices');
console.log('📋 User data:', activeUserNotices);

// Test 2: Admin Community Events → User Community Events
console.log('\n🎉 TEST 2: COMMUNITY EVENTS LINKING');

// Simulate admin adding an event
const adminEvents = [];
const newEvent = {
    id: Date.now() + 1,
    title: 'Console Test Event',
    description: 'This event was added via console to test linking',
    actionType: 'DIGITAL_LITERACY',
    targetAudience: 'ALL',
    district: 'Delhi',
    venue: 'Console Center',
    isActive: true,
    createdAt: new Date().toISOString()
};
adminEvents.push(newEvent);
localStorage.setItem('events', JSON.stringify(adminEvents));
console.log('✅ Admin saved event to localStorage["events"]');
console.log('📊 Admin data:', adminEvents);

// Simulate user reading events
const userEvents = JSON.parse(localStorage.getItem('events') || '[]');
const activeUserEvents = userEvents.filter(event => event.isActive);
console.log('✅ User read from localStorage["events"]');
console.log('📊 User sees:', activeUserEvents.length, 'active events');
console.log('📋 User data:', activeUserEvents);

// Summary
console.log('\n📋 SUMMARY:');
console.log('AdminNoticeBoard → localStorage["notices"] → NoticeBoard');
console.log('AdminCommunityEvents → localStorage["events"] → CommunityEvents');
console.log('\n🎯 EXPECTED RESULT:');
console.log('- Admin pages should show the test data');
console.log('- User pages should show the same test data');
console.log('- Both should update automatically');

console.log('\n🔄 TO REFRESH PAGES:');
console.log('location.reload();');