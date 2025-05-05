
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/contexts/EventContext';
import { useBookings } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getEvent } = useEvents();
  const { hasUserBookedEvent, createBooking } = useBookings();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(getEvent(id || ''));
  const [isBooked, setIsBooked] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  useEffect(() => {
    if (!event) {
      navigate('/');
    } else {
      setIsBooked(hasUserBookedEvent(event.id));
    }
  }, [event, hasUserBookedEvent, navigate]);

  const handleBookEvent = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (event) {
      createBooking(event.id);
      setIsBooked(true);
      setIsBookingComplete(true);
    }
  };

  if (!event) {
    return null;
  }

  if (isBookingComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">Congratulations!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Your booking is confirmed!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have successfully booked a ticket for {event.name}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A confirmation has been saved to your account.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/')}>
              Browse More Events
            </Button>
            <Button variant="outline" onClick={() => navigate('/my-bookings')}>
              View My Bookings
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-wrap justify-between items-start gap-2">
                <Badge className="bg-primary">{event.category}</Badge>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(event.date)}
                </p>
              </div>
              <CardTitle className="text-2xl mt-2">{event.name}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Location</h3>
                <p>{event.venue}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Price</h3>
                <p className="text-xl font-bold text-primary">
                  ${event.price.toFixed(2)}
                </p>
              </div>
              
              {isBooked ? (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3 border border-green-200 dark:border-green-900">
                  <p className="text-green-700 dark:text-green-400 font-medium">
                    You have already booked this event
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleBookEvent}
                >
                  Book Now
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">About This Event</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
