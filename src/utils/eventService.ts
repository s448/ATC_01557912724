
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*');
    
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    
    // Convert and validate the data as Event[]
    if (!data) return [];
    
    // Ensure each item conforms to the Event interface
    return data.map(item => ({
      id: item.id as string,
      name: item.name as string,
      description: item.description as string,
      category: item.category as string,
      date: item.date as string,
      venue: item.venue as string,
      price: item.price as number,
      imageUrl: item.imageurl as string,
      createdBy: item.createdby as string
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const addEvent = async (event: Omit<Event, 'id'>, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        name: event.name,
        description: event.description,
        category: event.category,
        date: event.date,
        venue: event.venue,
        price: event.price,
        imageurl: event.imageUrl, // Note: column name in DB is lowercase
        createdby: userId // Note: column name in DB is lowercase
      }])
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to create event');
    }
    
    toast.success('Event created successfully!');
    
    // Convert the returned data to match the Event interface
    return {
      id: data[0].id as string,
      name: data[0].name as string,
      description: data[0].description as string,
      category: data[0].category as string,
      date: data[0].date as string,
      venue: data[0].venue as string,
      price: data[0].price as number,
      imageUrl: data[0].imageurl as string,
      createdBy: data[0].createdby as string
    } as Event;
  } catch (error: any) {
    toast.error(`Failed to create event: ${error.message}`);
    throw error;
  }
};

export const updateEvent = async (updatedEvent: Event) => {
  try {
    const { id, ...eventData } = updatedEvent;
    
    // Convert to match DB column names
    const dbEventData = {
      name: eventData.name,
      description: eventData.description,
      category: eventData.category,
      date: eventData.date,
      venue: eventData.venue,
      price: eventData.price,
      imageurl: eventData.imageUrl,
      createdby: eventData.createdBy
    };
    
    const { error } = await supabase
      .from('events')
      .update(dbEventData)
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    toast.success('Event updated successfully!');
    return updatedEvent;
  } catch (error: any) {
    toast.error(`Failed to update event: ${error.message}`);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    toast.success('Event deleted successfully!');
    return id;
  } catch (error: any) {
    toast.error(`Failed to delete event: ${error.message}`);
    throw error;
  }
};
