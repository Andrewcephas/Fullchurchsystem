import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  permissions?: string[];
  branch?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (codename: string) => boolean;
  refreshUser: () => Promise<void>;
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

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await apiService.get<User>('/auth/user/');
      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Periodic refresh for real-time permission sync
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      // Use a more silent check or just refresh user
      apiService.get<User>('/auth/user/').then(response => {
        if (response.data) {
          setUser(response.data);
        }
      }).catch(() => {
        // Silently fail or logout if session is really dead
      });
    }, 60000); // 1 minute is enough for sync
    
    return () => clearInterval(interval);
  }, [!!user]); // Only restart interval when login status changes

   const login = async (username: string, password: string): Promise<boolean> => {
     try {
       setLoading(true);
       const response = await apiService.post<any>('/auth/login/', {
         username,
         password,
       });

       if (response.data && response.data.user) {
         setUser(response.data.user);
         return true;
       }
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

  const hasPermission = (codename: string): boolean => {
    if (!user || !user.permissions) return false;
    if (user.is_superuser) return true;
    return user.permissions.includes('*') || user.permissions.includes(codename);
  };

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    hasPermission,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};