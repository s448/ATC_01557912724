
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { formatDate } from '@/lib/utils';
import { useBookings } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { hasUserBookedEvent } = useBookings();
  const { isAuthenticated } = useAuth();
  const isBooked = hasUserBookedEvent(event.id);
  
  return (
    <Card className="event-card overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-1">{event.name}</CardTitle>
          <Badge className="bg-primary">{event.category}</Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(event.date)}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3">{event.description}</p>
        <p className="mt-2 text-sm font-medium">
          <span className="text-gray-500 dark:text-gray-400">Venue:</span> {event.venue}
        </p>
        <p className="mt-1 text-lg font-bold text-primary">
          ${event.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter>
        {isBooked ? (
          <Badge variant="outline" className="w-full py-2 justify-center border-green-500 text-green-600 dark:text-green-400">
            Booked
          </Badge>
        ) : (
          <Button className="w-full" asChild>
            <Link to={`/events/${event.id}`}>
              {isAuthenticated ? 'Book Now' : 'View Details'}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
