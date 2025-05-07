
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Booking } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  createBooking: (eventId: string) => Promise<Booking | null>;
  cancelBooking: (id: string) => Promise<void>;
  isBookedByUser: (eventId: string) => boolean;
  hasUserBookedEvent: (eventId: string) => boolean;
  getUserBookings: () => Promise<Booking[]>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserBookings(user.id);
    } else {
      setBookings([]);
    }
  }, [isAuthenticated, user]);

  const fetchUserBookings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, events(*)')
        .eq('userid', userId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) return;
      
      const bookingsData = data.map(item => ({
        id: item.id,
        eventId: item.eventid,
        userId: item.userid,
        bookingDate: item.bookingdate,
      }));
      
      setBookings(bookingsData);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
    }
  };

  const createBooking = async (eventId: string): Promise<Booking | null> => {
    if (!user) {
      toast.error('You must be logged in to book an event');
      return null;
    }
    
    try {
      // Format the booking data to match DB column names
      const bookingData = {
        eventid: eventId,
        userid: user.id,
        bookingdate: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error('Failed to create booking');
      }
      
      // Convert DB column names to frontend format
      const newBooking = {
        id: data.id,
        eventId: data.eventid,
        userId: data.userid,
        bookingDate: data.bookingdate
      };
      
      setBookings([...bookings, newBooking]);
      toast.success('Event booked successfully!');
      return newBooking;
    } catch (error: any) {
      toast.error(`Failed to book event: ${error.message}`);
      return null;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setBookings(bookings.filter(booking => booking.id !== id));
      toast.success('Booking cancelled successfully');
    } catch (error: any) {
      toast.error(`Failed to cancel booking: ${error.message}`);
    }
  };

  const isBookedByUser = (eventId: string) => {
    return bookings.some(booking => booking.eventId === eventId);
  };

  // Add the missing method that was causing the build error
  const hasUserBookedEvent = (eventId: string) => {
    return bookings.some(booking => booking.eventId === eventId);
  };

  // Add the missing method that was causing the build error
  const getUserBookings = async (): Promise<Booking[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, events(*)')
        .eq('userid', user.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data) return [];
      
      return data.map(item => ({
        id: item.id,
        eventId: item.eventid,
        userId: item.userid,
        bookingDate: item.bookingdate,
      }));
    } catch (error: any) {
      console.error('Error in getUserBookings:', error);
      return [];
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        cancelBooking,
        isBookedByUser,
        hasUserBookedEvent,
        getUserBookings,
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
