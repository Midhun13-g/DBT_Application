import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('dbt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Use API for authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      const authData = await response.json();
      const userSession = authData.user;
      
      console.log('🔍 Auth response:', authData);
      console.log('👤 User session:', userSession);
      console.log('🎯 User role:', userSession.role);
      
      setUser(userSession);
      localStorage.setItem('dbt_user', JSON.stringify(userSession));
      localStorage.setItem('auth_token', authData.token);
      
      // Initialize socket connection after login
      try {
        const { default: socketService } = await import('../services/socketService');
        await socketService.connect();
        socketService.registerUser({
          userId: userSession.id,
          role: userSession.role,
          name: userSession.name
        });
        console.log('✅ Socket connection initialized for user:', userSession.role);
      } catch (socketError) {
        console.warn('⚠️ Socket connection failed:', socketError.message);
      }
      
      const redirectPath = authData.redirectTo || (userSession.role === 'ADMIN' ? '/admin' : '/');
      console.log('🚀 Redirect path:', redirectPath);
      
      return {
        ...userSession,
        redirectTo: redirectPath
      };
    } catch (error) {
      console.error('💥 Login error:', error.message);
      throw error;
    }
  };

  const signup = async (name, email, password, phone) => {
    try {
      console.log('📝 Attempting signup for:', email);
      
      // Use API for registration
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, phone })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const userData = await response.json();
      
      // Auto-login after successful registration
      return await login(email, password);
    } catch (error) {
      console.error('💥 Signup error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dbt_user');
    localStorage.removeItem('auth_token');
    console.log('👋 User logged out');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('dbt_user', JSON.stringify(userData));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }