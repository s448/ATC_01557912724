
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Event } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // Load events from Supabase
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');
      
      if (error) {
        console.error('Error fetching events:', error);
        return;
      }
      
      if (data) {
        setEvents(data as Event[]);
      }
    };
    
    fetchEvents();
    
    // Subscribe to changes in the events table
    const eventsSubscription = supabase
      .channel('events-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'events' 
      }, () => {
        fetchEvents();
      })
      .subscribe();
      
    return () => {
      eventsSubscription.unsubscribe();
    };
  }, []);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...event,
          createdBy: user.id
        }])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        setEvents(prev => [...prev, data[0] as Event]);
        toast.success('Event created successfully!');
      }
    } catch (error: any) {
      toast.error(`Failed to create event: ${error.message}`);
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updatedEvent)
        .eq('id', updatedEvent.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      
      toast.success('Event updated successfully!');
    } catch (error: any) {
      toast.error(`Failed to update event: ${error.message}`);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete event: ${error.message}`);
    }
  };

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEvent
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
