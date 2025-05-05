
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Booking } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';

interface BookingContextType {
  bookings: Booking[];
  createBooking: (eventId: string) => void;
  cancelBooking: (bookingId: string) => void;
  getUserBookings: () => Booking[];
  hasUserBookedEvent: (eventId: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('eventHorizonBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const createBooking = (eventId: string) => {
    if (!user) {
      toast.error('You must be logged in to book an event');
      return;
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      eventId,
      userId: user.id,
      bookingDate: new Date().toISOString()
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('eventHorizonBookings', JSON.stringify(updatedBookings));
    toast.success('Event booked successfully!');
  };

  const cancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem('eventHorizonBookings', JSON.stringify(updatedBookings));
    toast.success('Booking cancelled successfully!');
  };

  const getUserBookings = () => {
    if (!user) return [];
    return bookings.filter(booking => booking.userId === user.id);
  };

  const hasUserBookedEvent = (eventId: string) => {
    if (!user) return false;
    return bookings.some(booking => booking.eventId === eventId && booking.userId === user.id);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        cancelBooking,
        getUserBookings,
        hasUserBookedEvent
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
