
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Booking } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface BookingContextType {
  bookings: Booking[];
  createBooking: (eventId: string) => void;
  cancelBooking: (bookingId: string) => Promise<void>;
  getUserBookings: (userId: string) => Booking[];
  hasUserBookedEvent: (eventId: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load user's bookings when authenticated
    const fetchBookings = async () => {
      if (!user) {
        setBookings([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('userId', user.id);
        
      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }
      
      if (data) {
        // Type cast the data to Booking[]
        setBookings(data as unknown as Booking[]);
      }
    };
    
    fetchBookings();
    
    // Subscribe to changes in the bookings table for the current user
    let bookingsSubscription: any;
    
    if (user) {
      bookingsSubscription = supabase
        .channel('bookings-channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `userId=eq.${user.id}`
        }, () => {
          fetchBookings();
        })
        .subscribe();
    }
      
    return () => {
      if (bookingsSubscription) {
        bookingsSubscription.unsubscribe();
      }
    };
  }, [user]);

  const createBooking = async (eventId: string) => {
    if (!user) {
      toast.error('You must be logged in to book an event');
      return;
    }
    
    // Check if user has already booked this event
    if (hasUserBookedEvent(eventId)) {
      toast.error('You have already booked this event');
      return;
    }

    const newBooking: Omit<Booking, 'id'> = {
      eventId,
      userId: user.id,
      bookingDate: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Properly type cast the data
        setBookings(prev => [...prev, data[0] as unknown as Booking]);
        toast.success('Booking successful!');
      }
    } catch (error: any) {
      toast.error(`Failed to create booking: ${error.message}`);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    if (!user) {
      toast.error('You must be logged in to cancel a booking');
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .eq('userId', user.id); // Ensure the user can only cancel their own bookings

      if (error) {
        throw new Error(error.message);
      }

      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (error: any) {
      toast.error(`Failed to cancel booking: ${error.message}`);
    }
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
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
