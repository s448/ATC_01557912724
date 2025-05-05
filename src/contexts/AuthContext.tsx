
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
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
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

  // Password reset request function
  const requestPasswordReset = async (email: string) => {
    // Find if the user exists
    const userExists = mockUsers.some(user => user.email === email);
    
    if (userExists) {
      // Generate a reset token (in a real app, this would be a secure random token)
      const token = Math.random().toString(36).substring(2, 15);
      
      // Find the user and set the reset token
      const userIndex = mockUsers.findIndex(user => user.email === email);
      if (userIndex !== -1) {
        mockUsers[userIndex].resetToken = token;
        
        // In a real app, you would send an email with a link to the reset page
        console.log(`Reset token for ${email}: ${token}`);
        console.log(`Reset link: ${window.location.origin}/reset-password?token=${token}`);
        
        // For demo purposes, we'll store the token in localStorage
        localStorage.setItem('passwordResetToken', JSON.stringify({ email, token }));
      }
    }
    
    // Always return success to prevent email enumeration attacks
    // In a real app, you would send an actual email here
    return Promise.resolve();
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    // In a real app, you would verify the token on the server
    const storedReset = localStorage.getItem('passwordResetToken');
    
    if (!storedReset) {
      throw new Error('Invalid or expired reset token');
    }
    
    const { email, token: storedToken } = JSON.parse(storedReset);
    
    if (token !== storedToken) {
      throw new Error('Invalid or expired reset token');
    }
    
    // Find the user and update their password
    const userIndex = mockUsers.findIndex(user => user.email === email);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // In a real app, you would hash the password
    // For demo purposes, we're just clearing the reset token
    mockUsers[userIndex].resetToken = undefined;
    
    // Clear the stored token
    localStorage.removeItem('passwordResetToken');
    
    toast.success('Password reset successful');
    return Promise.resolve();
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
        logout,
        requestPasswordReset,
        resetPassword
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
