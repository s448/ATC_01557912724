
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id, session.user.email);
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    // Check for existing user session
    const getUser = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in getUser:', error);
        toast.error('Failed to retrieve authentication state');
      } finally {
        setIsLoading(false);
      }
    };
    
    getUser();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, email: string | undefined) => {
    try {
      // Get user profile from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('username, role')
        .eq('id', userId)
        .maybeSingle(); // Using maybeSingle instead of single to handle cases where the user might not exist
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        setUser({
          id: userId,
          username: data.username as string,
          email: email || '',
          role: data.role as 'admin' | 'user'
        });
      } else {
        // If user doesn't exist in the users table, set to null
        console.warn('User authenticated but profile not found');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
      setUser(null);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
};
