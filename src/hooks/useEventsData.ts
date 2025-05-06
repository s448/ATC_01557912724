
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import * as eventService from '@/utils/eventService';

export const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load events from Supabase
    const fetchEventsData = async () => {
      const data = await eventService.fetchEvents();
      setEvents(data);
    };
    
    fetchEventsData();
    
    // Subscribe to changes in the events table
    const eventsSubscription = supabase
      .channel('events-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'events' 
      }, () => {
        fetchEventsData();
      })
      .subscribe();
      
    return () => {
      eventsSubscription.unsubscribe();
    };
  }, []);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    if (!user) return;
    
    const newEvent = await eventService.addEvent(event, user.id);
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = async (updatedEvent: Event) => {
    await eventService.updateEvent(updatedEvent);
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const deleteEventById = async (id: string) => {
    await eventService.deleteEvent(id);
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent: deleteEventById,
    getEvent
  };
};
