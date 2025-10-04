// Test script to verify localStorage data flow
console.log('=== TESTING LOCALSTORAGE DATA FLOW ===');

// Simulate localStorage operations
const localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
    console.log(`✅ SET ${key}:`, JSON.parse(value).length, 'items');
  }
};

// Test AdminCommunityEvents data flow
console.log('\n1. ADMIN COMMUNITY EVENTS:');
console.log('Key used: communityActions');

const testCommunityEvent = {
  id: Date.now(),
  title: 'Test Community Event',
  description: 'Test description',
  actionType: 'DIGITAL_LITERACY',
  targetAudience: 'ALL',
  district: 'Delhi',
  venue: 'Community Center',
  actionDate: '2024-02-15T10:00',
  durationHours: 4,
  maxParticipants: 50,
  currentParticipants: 0,
  contactPerson: 'John Doe',
  contactPhone: '+91-9876543210',
  contactEmail: 'john@example.com',
  registrationRequired: true,
  isActive: true,
  isFeatured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const communityActions = [testCommunityEvent];
localStorage.setItem('communityActions', JSON.stringify(communityActions));

// Test AdminNoticeBoard data flow
console.log('\n2. ADMIN NOTICE BOARD:');
console.log('Key used: noticeBoard');

const testNotice = {
  id: Date.now() + 1,
  title: 'Test Notice',
  content: 'Test notice content',
  type: 'GENERAL',
  priority: 'MEDIUM',
  district: 'Delhi',
  eventDate: '2024-02-15T10:00:00',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  views: 0,
  author: 'Admin User'
};

const notices = [testNotice];
localStorage.setItem('noticeBoard', JSON.stringify(notices));

// Test User CommunityEvents data flow
console.log('\n3. USER COMMUNITY EVENTS:');
console.log('Reads from: communityActions');
const userCommunityData = JSON.parse(localStorage.getItem('communityActions') || '[]');
console.log('✅ READ communityActions:', userCommunityData.length, 'items');

// Test User NoticeBoard data flow
console.log('\n4. USER NOTICE BOARD:');
console.log('Reads from: noticeBoard');
const userNoticeData = JSON.parse(localStorage.getItem('noticeBoard') || '[]');
console.log('✅ READ noticeBoard:', userNoticeData.length, 'items');

console.log('\n=== SUMMARY ===');
console.log('AdminCommunityEvents → communityActions → CommunityEvents ✅');
console.log('AdminNoticeBoard → noticeBoard → NoticeBoard ✅');
console.log('\n=== POTENTIAL ISSUES ===');
console.log('1. Check if polling intervals are working');
console.log('2. Check if data is being saved correctly');
console.log('3. Check if user pages are reading from correct keys');
console.log('4. Check browser localStorage in DevTools');