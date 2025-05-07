
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const seedDatabase = async () => {
  try {
    console.log('Checking if database needs seeding...');
    
    // Check if events already exist
    const { data: existingEvents } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (existingEvents && existingEvents.length > 0) {
      console.log('Database already has events, skipping event seed');
    } else {
      console.log('Seeding database with initial event data...');
      await seedEvents();
    }
    
    // Always make sure demo users exist
    await ensureDemoUsers();
    
    console.log('Database seeding complete!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    toast.error('Failed to load demo data');
  }
};

const ensureDemoUsers = async () => {
  try {
    // Check for admin user
    const { data: adminUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@example.com')
      .maybeSingle();
    
    if (!adminUser) {
      console.log('Creating admin demo user...');
      // Create admin auth user
      const { data: adminAuthUser, error: adminAuthError } = await supabase.auth.admin.createUser({
        email: 'admin@example.com',
        password: 'password',
        email_confirm: true
      });
      
      if (adminAuthError || !adminAuthUser.user) {
        // Fallback to regular signup if admin API fails
        const { data: adminFallback, error: adminFallbackError } = await supabase.auth.signUp({
          email: 'admin@example.com',
          password: 'password'
        });
        
        if (adminFallbackError) {
          console.error('Error creating admin auth user:', adminFallbackError);
          return;
        }
        
        if (adminFallback.user) {
          // Insert admin user record
          await supabase
            .from('users')
            .insert({
              id: adminFallback.user.id,
              username: 'admin',
              email: 'admin@example.com',
              role: 'admin'
            });
        }
      } else {
        // Insert admin user record
        await supabase
          .from('users')
          .insert({
            id: adminAuthUser.user.id,
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin'
          });
      }
    }
    
    // Check for regular user
    const { data: regularUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'user@example.com')
      .maybeSingle();
    
    if (!regularUser) {
      console.log('Creating regular demo user...');
      // Create regular auth user
      const { data: userAuthUser, error: userAuthError } = await supabase.auth.admin.createUser({
        email: 'user@example.com',
        password: 'password',
        email_confirm: true
      });
      
      if (userAuthError || !userAuthUser.user) {
        // Fallback to regular signup if admin API fails
        const { data: userFallback, error: userFallbackError } = await supabase.auth.signUp({
          email: 'user@example.com',
          password: 'password'
        });
        
        if (userFallbackError) {
          console.error('Error creating regular auth user:', userFallbackError);
          return;
        }
        
        if (userFallback.user) {
          // Insert regular user record
          await supabase
            .from('users')
            .insert({
              id: userFallback.user.id,
              username: 'user',
              email: 'user@example.com',
              role: 'user'
            });
        }
      } else {
        // Insert regular user record
        await supabase
          .from('users')
          .insert({
            id: userAuthUser.user.id,
            username: 'user',
            email: 'user@example.com',
            role: 'user'
          });
      }
    }
    
    console.log('Demo users are ready');
  } catch (error) {
    console.error('Error ensuring demo users exist:', error);
  }
};

const seedEvents = async () => {
  try {
    // Get admin ID for event creation
    const { data: adminData } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .maybeSingle();
    
    const adminId = adminData?.id;
    
    if (!adminId) {
      console.error('Admin ID not found, cannot seed events');
      return;
    }
    
    // Seed events
    const eventData = [
      {
        name: 'Summer Music Festival',
        description: 'A weekend of live music performances across multiple stages.',
        category: 'Music',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        venue: 'Central Park',
        price: 75.00,
        imageurl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3',
        createdby: adminId
      },
      {
        name: 'Tech Conference 2023',
        description: 'Learn about the latest advancements in technology.',
        category: 'Conference',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        venue: 'Convention Center',
        price: 150.00,
        imageurl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3',
        createdby: adminId
      },
      {
        name: 'Comedy Night',
        description: 'An evening of stand-up comedy with top comedians.',
        category: 'Comedy',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        venue: 'Comedy Club',
        price: 25.00,
        imageurl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3',
        createdby: adminId
      },
      {
        name: 'Art Exhibition',
        description: 'Showcasing works from local and international artists.',
        category: 'Arts & Culture',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        venue: 'City Gallery',
        price: 15.00,
        imageurl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3',
        createdby: adminId
      },
      {
        name: 'Food & Wine Festival',
        description: 'Taste dishes and wines from top chefs and vineyards.',
        category: 'Food & Drink',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        venue: 'Riverfront Park',
        price: 45.00,
        imageurl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3',
        createdby: adminId
      },
      {
        name: 'Marathon',
        description: 'Annual city marathon for all skill levels.',
        category: 'Sports',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
        venue: 'City Streets',
        price: 30.00,
        imageurl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-4.0.3',
        createdby: adminId
      }
    ];
    
    // Insert events
    const { error: eventsError } = await supabase
      .from('events')
      .insert(eventData);
    
    if (eventsError) {
      console.error('Error seeding events:', eventsError);
    }
    
  } catch (error) {
    console.error('Error seeding events:', error);
  }
};
