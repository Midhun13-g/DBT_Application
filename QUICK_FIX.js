// QUICK FIX - Run this in console on BOTH admin and user pages

console.log('🔧 QUICK FIX - Adding test data to localStorage');

// Add test notices
const testNotices = [
  {
    id: 1,
    title: 'Test Notice 1',
    content: 'This is the first test notice',
    type: 'GENERAL',
    priority: 'HIGH',
    district: 'Delhi',
    isActive: true,
    createdAt: new Date().toISOString(),
    author: 'Test Admin'
  },
  {
    id: 2,
    title: 'Test Notice 2', 
    content: 'This is the second test notice',
    type: 'GENERAL',
    priority: 'MEDIUM',
    district: 'Mumbai',
    isActive: true,
    createdAt: new Date().toISOString(),
    author: 'Test Admin'
  }
];

localStorage.setItem('notices', JSON.stringify(testNotices));
console.log('✅ Added test notices to localStorage');

// Verify
const stored = localStorage.getItem('notices');
const parsed = JSON.parse(stored);
console.log('📊 Verification - localStorage now has:', parsed.length, 'notices');

// Add test events too
const testEvents = [
  {
    id: 1,
    title: 'Test Event 1',
    description: 'This is the first test event',
    actionType: 'DIGITAL_LITERACY',
    targetAudience: 'ALL',
    district: 'Delhi',
    venue: 'Community Center',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

localStorage.setItem('events', JSON.stringify(testEvents));
console.log('✅ Added test events to localStorage');

console.log('🔄 Now refresh both admin and user pages to see the test data');
console.log('📋 Admin pages should show the test data');
console.log('👥 User pages should show the same test data');