
import { supabase } from '@/lib/supabase';

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Check if any events exist
    const { data: existingEvents, error: checkError } = await supabase
      .from('events')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Error checking for existing events:', checkError);
      return;
    }
    
    // If events already exist, don't seed
    if (existingEvents && existingEvents.length > 0) {
      console.log('Database already has events, skipping seed...');
      return;
    }

    // Get the first admin user to set as event creator
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single();
      
    if (userError || !adminUser) {
      console.error('Error finding admin user, using authenticated user instead');
      
      // Fall back to the currently authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No user available for seeding events');
        return;
      }
      
      const creatorId = user.id;
      
      // Seed events with mock data
      const mockEvents = [
        {
          name: 'Tech Conference 2023',
          description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders.',
          category: 'Technology',
          date: '2023-09-15T09:00',
          venue: 'Tech Center, Downtown',
          price: 149.99,
          imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
          createdBy: creatorId
        },
        {
          name: 'Music Festival',
          description: 'A weekend of amazing music performances from top artists across all genres.',
          category: 'Music',
          date: '2023-10-20T16:00',
          venue: 'Central Park',
          price: 89.99,
          imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
          createdBy: creatorId
        },
        {
          name: 'Coding Workshop',
          description: 'Learn the latest web development technologies in this intensive workshop.',
          category: 'Education',
          date: '2023-08-05T10:00',
          venue: 'Innovation Hub',
          price: 49.99,
          imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
          createdBy: creatorId
        },
        {
          name: 'Business Networking',
          description: 'Connect with professionals in your industry and expand your network.',
          category: 'Business',
          date: '2023-09-10T18:30',
          venue: 'Grand Hotel',
          price: 25.00,
          imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
          createdBy: creatorId
        }
      ];
      
      const { error: insertError } = await supabase
        .from('events')
        .insert(mockEvents);
        
      if (insertError) {
        console.error('Error seeding events:', insertError);
      } else {
        console.log('Events seeded successfully!');
      }
    } else {
      // Use the admin user to create events
      const creatorId = adminUser.id;
      
      // Seed events with mock data
      const mockEvents = [
        {
          name: 'Tech Conference 2023',
          description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders.',
          category: 'Technology',
          date: '2023-09-15T09:00',
          venue: 'Tech Center, Downtown',
          price: 149.99,
          imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
          createdBy: creatorId
        },
        {
          name: 'Music Festival',
          description: 'A weekend of amazing music performances from top artists across all genres.',
          category: 'Music',
          date: '2023-10-20T16:00',
          venue: 'Central Park',
          price: 89.99,
          imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
          createdBy: creatorId
        },
        {
          name: 'Coding Workshop',
          description: 'Learn the latest web development technologies in this intensive workshop.',
          category: 'Education',
          date: '2023-08-05T10:00',
          venue: 'Innovation Hub',
          price: 49.99,
          imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
          createdBy: creatorId
        },
        {
          name: 'Business Networking',
          description: 'Connect with professionals in your industry and expand your network.',
          category: 'Business',
          date: '2023-09-10T18:30',
          venue: 'Grand Hotel',
          price: 25.00,
          imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
          createdBy: creatorId
        }
      ];
      
      const { error: insertError } = await supabase
        .from('events')
        .insert(mockEvents);
        
      if (insertError) {
        console.error('Error seeding events:', insertError);
      } else {
        console.log('Events seeded successfully!');
      }
    }
  } catch (error) {
    console.error('Error in seed function:', error);
  }
};
