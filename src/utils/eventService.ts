
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
    
    return (data || []) as Event[];
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
        ...event,
        createdBy: userId
      }])
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to create event');
    }
    
    toast.success('Event created successfully!');
    return data[0] as Event;
  } catch (error: any) {
    toast.error(`Failed to create event: ${error.message}`);
    throw error;
  }
};

export const updateEvent = async (updatedEvent: Event) => {
  try {
    const { id, ...eventWithoutId } = updatedEvent;
    
    const { error } = await supabase
      .from('events')
      .update(eventWithoutId)
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
