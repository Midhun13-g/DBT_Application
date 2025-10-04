// Run this in console on the USER NoticeBoard page (/notice-board)

console.log('🔍 DEBUGGING USER NOTICE BOARD');

// Check what's in localStorage
const stored = localStorage.getItem('notices');
console.log('📚 Raw localStorage["notices"]:', stored);

if (stored) {
  const parsed = JSON.parse(stored);
  console.log('📊 Parsed data:', parsed.length, 'total notices');
  console.log('📋 All notices:', parsed);
  
  const active = parsed.filter(n => n.isActive);
  console.log('✅ Active notices:', active.length);
  console.log('📋 Active data:', active);
  
  if (active.length === 0) {
    console.log('❌ PROBLEM: No active notices found');
    console.log('💡 Check if notices have isActive: true');
  }
} else {
  console.log('❌ PROBLEM: No data in localStorage["notices"]');
  console.log('💡 Admin might be saving to different key');
}

// Check if user page is reading correctly
console.log('\n🔄 TESTING USER PAGE LOAD FUNCTION');
try {
  const testStored = localStorage.getItem('notices') || '[]';
  const testData = JSON.parse(testStored);
  const testActive = testData.filter(notice => notice.isActive);
  console.log('✅ User load function would see:', testActive.length, 'notices');
} catch (error) {
  console.log('❌ Error in user load function:', error);
}