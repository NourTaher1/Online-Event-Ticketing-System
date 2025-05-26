import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Configure axios defaults
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check localStorage for existing user data on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (userData) => {
    try {
      const response = await api.post('/api/v1/login', userData);
      if (response.data.user) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/v1/register', userData);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/v1/logout');
      // Clear user data from localStorage
      localStorage.removeItem('user');
      setUser(null);
      // Force a page reload to clear any remaining state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the server request fails, clear the local state
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/';
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/api/v1/forgot-password', { email });
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
      return false;
    }
  };

  // Verify token and refresh user data on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await api.get('/api/v1/verify');
        if (response.data.user) {
          // Update user data in localStorage and state
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
      } catch (error) {
        // If verification fails, clear the user data
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    verifyAuth();
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOrganizer: user?.role === 'organizer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 