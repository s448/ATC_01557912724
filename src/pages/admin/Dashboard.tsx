
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEvents } from '@/contexts/EventContext';
import { useBookings } from '@/contexts/BookingContext';
import { formatDate } from '@/lib/utils';

const AdminDashboard = () => {
  const { events, deleteEvent } = useEvents();
  const { bookings } = useBookings();
  const navigate = useNavigate();

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your events</p>
        </div>
        <Button onClick={() => navigate('/admin/events/new')}>
          Create New Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{events.length}</CardTitle>
            <CardDescription>Total Events</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{bookings.length}</CardTitle>
            <CardDescription>Total Bookings</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              ${events.reduce((total, event) => {
                const eventBookings = bookings.filter(b => b.eventId === event.id).length;
                return total + (event.price * eventBookings);
              }, 0).toFixed(2)}
            </CardTitle>
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Events</h2>
      
      {events.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No events found</CardTitle>
            <CardDescription>
              You haven't created any events yet.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/admin/events/new')}>
              Create Your First Event
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted dark:bg-muted/50">
                <th className="text-left p-3">Event Name</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Venue</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Bookings</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => {
                const eventBookings = bookings.filter(b => b.eventId === event.id).length;
                
                return (
                  <tr key={event.id} className="border-b border-border">
                    <td className="p-3">{event.name}</td>
                    <td className="p-3">{formatDate(event.date)}</td>
                    <td className="p-3">{event.venue}</td>
                    <td className="p-3">${event.price.toFixed(2)}</td>
                    <td className="p-3">{eventBookings}</td>
                    <td className="p-3 text-right space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/events/edit/${event.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
