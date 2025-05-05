
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBookings } from '@/contexts/BookingContext';
import { useEvents } from '@/contexts/EventContext';
import { formatDate } from '@/lib/utils';

const MyBookings = () => {
  const { getUserBookings, cancelBooking } = useBookings();
  const { getEvent } = useEvents();
  const navigate = useNavigate();
  
  const userBookings = getUserBookings();
  
  const bookingsWithEventDetails = userBookings.map(booking => {
    const event = getEvent(booking.eventId);
    return {
      booking,
      event
    };
  }).filter(item => item.event !== undefined);

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your event bookings</p>
      </div>
      
      {bookingsWithEventDetails.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No bookings found</CardTitle>
            <CardDescription>
              You haven't booked any events yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>
              Browse Events
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookingsWithEventDetails.map(({ booking, event }) => (
            event && (
              <Card key={booking.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 h-32 md:h-auto">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{event.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(event.date)} | {event.venue}
                        </p>
                      </div>
                      <p className="font-medium text-primary">
                        ${event.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          View Event
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
