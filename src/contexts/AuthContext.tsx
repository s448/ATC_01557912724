
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check for existing user session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { id, email } = session.user;
        
        // Get user profile from Supabase
        const { data } = await supabase
          .from('users')
          .select('username, role')
          .eq('id', id)
          .single();
        
        if (data) {
          setUser({
            id,
            username: data.username,
            email: email || '',
            role: data.role as 'admin' | 'user'
          });
        }
      }
    };
    
    getUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { id, email } = session.user;
        
        // Get user profile from Supabase
        const { data } = await supabase
          .from('users')
          .select('username, role')
          .eq('id', id)
          .single();
        
        if (data) {
          setUser({
            id,
            username: data.username,
            email: email || '',
            role: data.role as 'admin' | 'user'
          });
        }
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Login successful!');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Register the user in Supabase Auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (authError) {
        throw new Error(authError.message);
      }
      
      if (!authUser) {
        throw new Error('Registration failed');
      }
      
      // Create the user's profile in the users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            username,
            email,
            role: 'user' // Default role
          }
        ]);
      
      if (profileError) {
        throw new Error(profileError.message);
      }
      
      toast.success('Registration successful!');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register');
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout failed');
    } else {
      toast.success('Logged out successfully');
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return Promise.resolve();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset link');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      // Note: In Supabase, the token handling is automatic when using their auth.updateUser method
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Password reset successful');
      return Promise.resolve();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to reset password');
    }
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
