// Debug script - Run this in browser console to test localStorage

console.log('🔍 DEBUGGING LOCALSTORAGE OPERATIONS');

// Test 1: Check current localStorage
console.log('\n1. CURRENT LOCALSTORAGE:');
console.log('notices:', localStorage.getItem('notices'));
console.log('events:', localStorage.getItem('events'));

// Test 2: Add a notice manually
console.log('\n2. ADDING TEST NOTICE:');
const notices = JSON.parse(localStorage.getItem('notices') || '[]');
const testNotice = {
  id: Date.now(),
  title: 'Debug Test Notice',
  content: 'This is a debug test notice',
  type: 'GENERAL',
  priority: 'MEDIUM',
  district: 'Delhi',
  isActive: true,
  createdAt: new Date().toISOString(),
  author: 'Debug Admin'
};
notices.unshift(testNotice);
localStorage.setItem('notices', JSON.stringify(notices));
console.log('✅ Added notice, total:', notices.length);

// Test 3: Add an event manually
console.log('\n3. ADDING TEST EVENT:');
const events = JSON.parse(localStorage.getItem('events') || '[]');
const testEvent = {
  id: Date.now() + 1,
  title: 'Debug Test Event',
  description: 'This is a debug test event',
  actionType: 'DIGITAL_LITERACY',
  targetAudience: 'ALL',
  district: 'Delhi',
  venue: 'Debug Center',
  actionDate: '2024-02-15T10:00',
  durationHours: 2,
  maxParticipants: 50,
  currentParticipants: 0,
  isActive: true,
  isFeatured: false,
  createdAt: new Date().toISOString()
};
events.unshift(testEvent);
localStorage.setItem('events', JSON.stringify(events));
console.log('✅ Added event, total:', events.length);

// Test 4: Verify data
console.log('\n4. VERIFICATION:');
const finalNotices = JSON.parse(localStorage.getItem('notices') || '[]');
const finalEvents = JSON.parse(localStorage.getItem('events') || '[]');
console.log('Final notices count:', finalNotices.length);
console.log('Final events count:', finalEvents.length);

// Test 5: Clear all data
console.log('\n5. TO CLEAR ALL DATA, RUN:');
console.log('localStorage.removeItem("notices");');
console.log('localStorage.removeItem("events");');
console.log('location.reload();');

console.log('\n✅ DEBUG COMPLETE - Check the data above');