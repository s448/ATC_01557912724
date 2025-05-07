
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

let supabaseInstance: ReturnType<typeof createClient>;

try {
  // Verify that we have valid Supabase credentials before creating the client
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials. Please check your environment variables.');
  }
  
  // Create the Supabase client with the provided credentials
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  
  // Create a mock client that will provide better feedback
  supabaseInstance = createClient(
    'https://placeholder-project.supabase.co',
    'placeholder-key'
  );
  
  // Override methods to provide clearer error messages
  const mockMethods = ['from', 'auth', 'storage', 'rpc', 'channel'];
  mockMethods.forEach(method => {
    if (typeof supabaseInstance[method] === 'function') {
      // @ts-ignore - Dynamically overriding methods
      supabaseInstance[method] = (...args: any[]) => {
        const errorMsg = 'Supabase is not properly configured. Please set up your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.';
        console.error(errorMsg);
        
        // Return mock methods that throw appropriate errors
        return {
          select: () => Promise.resolve({ data: [], error: { message: errorMsg } }),
          insert: () => Promise.resolve({ data: [], error: { message: errorMsg } }),
          update: () => Promise.resolve({ data: null, error: { message: errorMsg } }),
          delete: () => Promise.resolve({ data: null, error: { message: errorMsg } }),
          eq: () => ({ 
            data: null, 
            error: { message: errorMsg },
            select: () => Promise.resolve({ data: [], error: { message: errorMsg } }) 
          }),
          single: () => Promise.resolve({ data: null, error: { message: errorMsg } }),
          subscribe: () => ({ unsubscribe: () => {} }),
          on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
          signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: errorMsg } }),
          signUp: () => Promise.resolve({ data: { user: null }, error: { message: errorMsg } }),
          signOut: () => Promise.resolve({ error: { message: errorMsg } }),
          resetPasswordForEmail: () => Promise.resolve({ error: { message: errorMsg } }),
          updateUser: () => Promise.resolve({ error: { message: errorMsg } }),
        };
      };
    }
  });
  
  // Display an error toast
  setTimeout(() => {
    toast.error('Supabase connection failed. Please connect to Supabase from the project settings.');
  }, 1000);
}

export const supabase = supabaseInstance;
