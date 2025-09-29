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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 1,
        email,
        name: email === 'admin@dbt.gov.in' ? 'Admin User' : 'John Doe',
        role: email === 'admin@dbt.gov.in' ? 'admin' : 'user',
        phone: email === 'admin@dbt.gov.in' ? '9876543210' : '9876543211'
      };
      
      setUser(userData);
      localStorage.setItem('dbt_user', JSON.stringify(userData));
      
      // Return user data with redirect info
      return {
        ...userData,
        redirectTo: userData.role === 'admin' ? '/admin' : '/'
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (name, email, password, phone) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        name,
        email,
        phone,
        role: 'user'
      };
      
      setUser(userData);
      localStorage.setItem('dbt_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dbt_user');
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
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }