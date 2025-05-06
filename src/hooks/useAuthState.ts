
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

export const useAuthState = () => {
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
            username: data.username as string,
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
            username: data.username as string,
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

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
};
