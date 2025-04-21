import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './auth-types';
import { AuthService } from './auth-service';
import { useLocation } from 'wouter';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<User | null>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to wrap our app
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Short timeout to ensure localStorage is initialized
    setTimeout(checkAuth, 100);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const loggedInUser = AuthService.login({ email, password });
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };

  // Logout function
  const logout = () => {
    try {
      AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<User | null> => {
    try {
      const newUser = AuthService.register({
        username,
        email,
        password,
        confirmPassword: password
      });
      
      if (newUser) {
        // Auto login after registration is handled in auth-service
        setUser(newUser);
      }
      
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    }
  };

  // Value object to be provided to consumers
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth guard component to protect routes
interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};
