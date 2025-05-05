
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEvents } from '@/contexts/EventContext';
import { useBookings } from '@/contexts/BookingContext';
import { formatDate } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { ChartBar, ChartPie, ChartLine } from 'lucide-react';

const AdminDashboard = () => {
  const { events, deleteEvent } = useEvents();
  const { bookings } = useBookings();
  const navigate = useNavigate();

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  // Calculate revenue by event
  const revenueData = events.map(event => {
    const eventBookings = bookings.filter(b => b.eventId === event.id).length;
    const revenue = event.price * eventBookings;
    return {
      name: event.name,
      value: revenue,
      count: eventBookings
    };
  }).sort((a, b) => b.value - a.value);

  // Calculate bookings by event category
  const categoryData = events.reduce((acc, event) => {
    const eventBookings = bookings.filter(b => b.eventId === event.id).length;
    
    const existingCategory = acc.find(c => c.name === event.category);
    if (existingCategory) {
      existingCategory.value += eventBookings;
      existingCategory.count += 1;
    } else {
      acc.push({
        name: event.category,
        value: eventBookings,
        count: 1
      });
    }
    
    return acc;
  }, [] as { name: string; value: number; count: number }[]);

  // Booking trends (past 6 months)
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const bookingTrends = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(today.getMonth() - i);
    
    const monthStr = monthNames[month.getMonth()];
    const monthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate.getMonth() === month.getMonth() && 
             bookingDate.getFullYear() === month.getFullYear();
    }).length;
    
    return {
      name: monthStr,
      bookings: monthBookings
    };
  }).reverse();

  // Colors for charts
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#F59E0B'];

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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Trends Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <ChartLine className="mr-2 h-5 w-5 text-muted-foreground" />
              <CardTitle>Booking Trends</CardTitle>
            </div>
            <CardDescription>Monthly booking activity for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  line: { theme: { light: '#8B5CF6', dark: '#9b87f5' } },
                  grid: { theme: { light: '#E5DEFF', dark: '#1A1F2C' } }
                }}
              >
                <LineChart data={bookingTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grid)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    name="Bookings"
                    stroke="var(--color-line)"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Revenue by Event Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <ChartBar className="mr-2 h-5 w-5 text-muted-foreground" />
              <CardTitle>Revenue by Event</CardTitle>
            </div>
            <CardDescription>Top 5 revenue-generating events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  bar: { theme: { light: '#8B5CF6', dark: '#9b87f5' } }
                }}
              >
                <BarChart data={revenueData.slice(0, 5)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value} />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Revenue ($)" fill="var(--color-bar)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings by Category Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center">
              <ChartPie className="mr-2 h-5 w-5 text-muted-foreground" />
              <CardTitle>Bookings by Category</CardTitle>
            </div>
            <CardDescription>Distribution of bookings across event categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="custom-tooltip bg-background border border-border p-3 rounded-md shadow-md">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">{`Events: ${data.count}`}</p>
                          <p className="text-sm">{`Bookings: ${data.value}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
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
