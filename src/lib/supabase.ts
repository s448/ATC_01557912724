
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Using the correctly initialized Supabase client
export const supabase = supabaseClient;

// Export a helper function to determine if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabase && typeof supabase.from === 'function';
};

// Log initialization status
console.log('Supabase client initialization status:', isSupabaseConfigured() ? 'Success' : 'Failed');
