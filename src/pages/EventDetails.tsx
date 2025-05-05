
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
  const { hasUserBookedEvent } = useBookings();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(getEvent(id || ''));
  const [isBooked, setIsBooked] = useState(false);

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
      // Instead of directly booking, navigate to payment with event data
      navigate('/payment', { 
        state: { 
          eventId: event.id, 
          eventName: event.name, 
          eventPrice: event.price 
        }
      });
    }
  };

  if (!event) {
    return null;
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
                  Proceed to Payment
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
