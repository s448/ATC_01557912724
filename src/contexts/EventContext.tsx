
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Event } from '@/types';
import { toast } from '@/components/ui/sonner';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Mock initial events
const initialEvents: Event[] = [
  {
    id: '1',
    name: 'Tech Conference 2023',
    description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders.',
    category: 'Technology',
    date: '2023-09-15T09:00',
    venue: 'Tech Center, Downtown',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    createdBy: '1'
  },
  {
    id: '2',
    name: 'Music Festival',
    description: 'A weekend of amazing music performances from top artists across all genres.',
    category: 'Music',
    date: '2023-10-20T16:00',
    venue: 'Central Park',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    createdBy: '1'
  },
  {
    id: '3',
    name: 'Coding Workshop',
    description: 'Learn the latest web development technologies in this intensive workshop.',
    category: 'Education',
    date: '2023-08-05T10:00',
    venue: 'Innovation Hub',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    createdBy: '1'
  },
  {
    id: '4',
    name: 'Business Networking',
    description: 'Connect with professionals in your industry and expand your network.',
    category: 'Business',
    date: '2023-09-10T18:30',
    venue: 'Grand Hotel',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    createdBy: '1'
  }
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    // Load events from localStorage or use mock data
    const savedEvents = localStorage.getItem('eventHorizonEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(initialEvents);
      localStorage.setItem('eventHorizonEvents', JSON.stringify(initialEvents));
    }
  }, []);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString()
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('eventHorizonEvents', JSON.stringify(updatedEvents));
    toast.success('Event created successfully!');
  };

  const updateEvent = (updatedEvent: Event) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    
    setEvents(updatedEvents);
    localStorage.setItem('eventHorizonEvents', JSON.stringify(updatedEvents));
    toast.success('Event updated successfully!');
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('eventHorizonEvents', JSON.stringify(updatedEvents));
    toast.success('Event deleted successfully!');
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
