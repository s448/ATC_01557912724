
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import * as eventService from '@/utils/eventService';
import { toast } from 'sonner';

export const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load events from Supabase
    const fetchEventsData = async () => {
      try {
        setLoading(true);
        const data = await eventService.fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventsData();
    
    // Try to subscribe to changes in the events table
    let eventsSubscription: { unsubscribe: () => void } | null = null;
    
    try {
      eventsSubscription = supabase
        .channel('events-channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'events' 
        }, () => {
          fetchEventsData();
        })
        .subscribe();
    } catch (error) {
      console.error('Error subscribing to events channel:', error);
    }
      
    return () => {
      if (eventsSubscription) {
        eventsSubscription.unsubscribe();
      }
    };
  }, []);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      return Promise.reject('Not authenticated');
    }
    
    try {
      const newEvent = await eventService.addEvent(event, user.id);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      // Error is already handled in eventService
      return Promise.reject(error);
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      await eventService.updateEvent(updatedEvent);
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
      return updatedEvent;
    } catch (error) {
      // Error is already handled in eventService
      return Promise.reject(error);
    }
  };

  const deleteEventById = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      return id;
    } catch (error) {
      // Error is already handled in eventService
      return Promise.reject(error);
    }
  };

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent: deleteEventById,
    getEvent
  };
};
