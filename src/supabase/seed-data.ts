
// This file is used to seed the database with initial data
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
      console.log('Database already has data, skipping seed');
      return;
    }
    
    console.log('Seeding database with initial data...');
    
    // Create admin user if it doesn't exist
    const adminEmail = 'admin@example.com';
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();
    
    let adminId;
    
    if (!existingAdmin) {
      // Register the admin user
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: 'password',
      });
      
      if (authError) {
        console.error('Error creating admin auth user:', authError);
        return;
      }
      
      adminId = authUser.user?.id;
      
      if (adminId) {
        // Create the admin profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: adminId,
            username: 'admin',
            email: adminEmail,
            role: 'admin'
          });
        
        if (profileError) {
          console.error('Error creating admin profile:', profileError);
          return;
        }
      }
    } else {
      adminId = existingAdmin.id;
    }
    
    // Create regular user if it doesn't exist
    const userEmail = 'user@example.com';
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    let userId;
    
    if (!existingUser) {
      // Register the regular user
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: 'password',
      });
      
      if (authError) {
        console.error('Error creating user auth:', authError);
        return;
      }
      
      userId = authUser.user?.id;
      
      if (userId) {
        // Create the user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: userId,
            username: 'user',
            email: userEmail,
            role: 'user'
          });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return;
        }
      }
    } else {
      userId = existingUser.id;
    }
    
    if (!adminId) {
      console.error('Admin ID not found, cannot seed events');
      return;
    }
    
    // Seed events - correct property names
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
    ];
    
    // Insert events - corrected property names match the db columns
    const { error: eventsError } = await supabase
      .from('events')
      .insert(eventData);
    
    if (eventsError) {
      console.error('Error seeding events:', eventsError);
      return;
    }
    
    // More event data - corrected property names
    const moreEvents = [
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
    
    // Insert more events - corrected property names
    const { error: moreEventsError } = await supabase
      .from('events')
      .insert(moreEvents);
    
    if (moreEventsError) {
      console.error('Error seeding more events:', moreEventsError);
      return;
    }
    
    console.log('Database seeded successfully!');
    toast.success('Demo data loaded successfully');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    toast.error('Failed to load demo data');
  }
};
