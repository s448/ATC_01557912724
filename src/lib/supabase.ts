
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development mode and provide placeholder defaults for local development
const isDevelopment = import.meta.env.DEV;

let supabaseInstance: ReturnType<typeof createClient>;

try {
  // If we have the required values, create the client
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } 
  // For development, create a mock client that won't cause crashes
  else if (isDevelopment) {
    console.warn('Supabase credentials missing. Using mock client for development.');
    // Use placeholder values for development
    const devUrl = 'https://placeholder-project.supabase.co';
    const devKey = 'placeholder-key';
    
    supabaseInstance = createClient(devUrl, devKey);
    
    // Override methods to prevent real API calls
    const mockMethods = ['auth', 'from', 'storage', 'rpc', 'channel'];
    mockMethods.forEach(method => {
      if (typeof supabaseInstance[method] === 'function') {
        // @ts-ignore - Dynamically overriding methods
        supabaseInstance[method] = (...args: any[]) => {
          console.warn(`Supabase ${method} called without proper credentials`);
          // Return an object that has common methods but doesn't do anything
          return {
            select: () => ({ data: null, error: { message: 'No Supabase credentials' } }),
            insert: () => ({ data: null, error: { message: 'No Supabase credentials' } }),
            update: () => ({ data: null, error: { message: 'No Supabase credentials' } }),
            delete: () => ({ data: null, error: { message: 'No Supabase credentials' } }),
            eq: () => ({ data: null, error: { message: 'No Supabase credentials' } }),
            single: () => ({ data: null, error: { message: 'No Supabase credentials' } }),
            subscribe: () => ({ data: null, error: { message: 'No Supabase credentials' } }),
            // Add more method mocks as needed
          };
        };
      }
    });
  } 
  // If not in development and missing credentials, provide a more graceful error
  else {
    throw new Error('Supabase credentials missing. Please add them to your environment variables.');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  
  // Create a non-functional client to prevent app crashes
  supabaseInstance = createClient(
    'https://placeholder-project.supabase.co',
    'placeholder-key'
  );
  
  // Display an error toast to notify users
  setTimeout(() => {
    toast.error('Database connection failed. Some features may not work properly.');
  }, 1000);
}

export const supabase = supabaseInstance;
