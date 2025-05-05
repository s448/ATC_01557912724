
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    role: 'user'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('eventHorizonUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, this is a mock login
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(user => user.email === email);
    
    if (foundUser && password.length >= 6) {
      setUser(foundUser);
      localStorage.setItem('eventHorizonUser', JSON.stringify(foundUser));
      toast.success('Login successful!');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    // For demo purposes, we'll just simulate registration
    // In a real app, this would be an API call
    if (mockUsers.some(user => user.email === email)) {
      throw new Error('User already exists');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      username,
      email,
      role: 'user'
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('eventHorizonUser', JSON.stringify(newUser));
    toast.success('Registration successful!');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventHorizonUser');
    toast.success('Logged out successfully');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
