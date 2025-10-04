// Debug script for admin login - run in browser console

console.log('🔍 DEBUGGING ADMIN LOGIN');

// Test login API directly
async function testAdminLogin() {
  try {
    console.log('📡 Testing admin login API...');
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@dbt.gov.in',
        password: 'admin123'
      })
    });
    
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('👤 User data:', data.user);
      console.log('🎯 User role:', data.user.role);
      console.log('🚀 Redirect to:', data.redirectTo);
      
      // Check if role is admin
      const isAdmin = data.user.role === 'ADMIN' || data.user.role === 'admin';
      console.log('🔐 Is admin?', isAdmin);
      
      return data;
    } else {
      const error = await response.json();
      console.error('❌ Login failed:', error);
      return null;
    }
  } catch (error) {
    console.error('💥 Network error:', error);
    return null;
  }
}

// Test the login
testAdminLogin().then(result => {
  if (result) {
    console.log('🎉 Admin login test completed successfully');
    console.log('Expected redirect:', result.redirectTo);
  } else {
    console.log('💔 Admin login test failed');
  }
});

// Check current auth state
console.log('📋 Current localStorage:');
console.log('- dbt_user:', localStorage.getItem('dbt_user'));
console.log('- auth_token:', localStorage.getItem('auth_token'));

// Check current URL
console.log('🌐 Current URL:', window.location.href);