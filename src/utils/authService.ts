
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const login = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Don't set toast here, it will be handled by the component
    return Promise.resolve();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to login');
  }
};

export const register = async (username: string, email: string, password: string) => {
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
          role: 'user' // Default role is 'user'
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

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error('Logout failed');
  } else {
    toast.success('Logged out successfully');
  }
};

export const requestPasswordReset = async (email: string) => {
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

export const resetPassword = async (token: string, newPassword: string) => {
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
