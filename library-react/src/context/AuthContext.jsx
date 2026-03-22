import { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI, studentAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin' or 'student'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('library_user');
    const storedType = localStorage.getItem('library_user_type');
    
    if (storedUser && storedType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedType);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, type) => {
    try {
      let response;
      if (type === 'admin') {
        response = await adminAPI.login(email, password);
      } else {
        response = await studentAPI.login(email, password);
      }

      if (response.success) {
        const userData = type === 'admin' 
          ? { ...response.data, isAdmin: true }
          : { ...response.data, isAdmin: false };
        
        setUser(userData);
        setUserType(type);
        localStorage.setItem('library_user', JSON.stringify(userData));
        localStorage.setItem('library_user_type', type);
        
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('library_user');
    localStorage.removeItem('library_user_type');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('library_user', JSON.stringify(userData));
  };

  const value = {
    user,
    userType,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
