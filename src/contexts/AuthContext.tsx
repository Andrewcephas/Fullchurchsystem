import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  role?: string;
  branch?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to access a protected endpoint to check if session is valid
      const response = await apiService.get('/auth/user/');
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      // Session is invalid or expired
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

   const login = async (username: string, password: string): Promise<boolean> => {
     try {
       setLoading(true);
       const response = await apiService.post('/auth/login/', {
         username,
         password,
       });

       if (response.data && response.data.user) {
         setUser(response.data.user);
         return true;
       }
       // If we get here, either response.error exists or data lacks user
       console.error('Login response missing user data:', response);
       return false;
     } catch (error) {
       console.error('Login failed:', error);
       return false;
     } finally {
       setLoading(false);
     }
   };

  const logout = async () => {
    try {
      await apiService.post('/auth/logout/', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};