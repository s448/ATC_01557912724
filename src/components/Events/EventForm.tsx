
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface EventFormProps {
  onSubmit: (event: Omit<Event, 'id'> | Event) => void;
  event?: Event;
  title: string;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, event, title }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    date: '',
    venue: '',
    price: 0,
    imageUrl: '',
    createdBy: user?.id || '',
  });

  useEffect(() => {
    if (event) {
      // Format the date for the input field
      const dateObj = new Date(event.date);
      const formattedDate = dateObj.toISOString().slice(0, 16);
      
      setFormData({
        ...event,
        date: formattedDate
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(event ? { ...formData, id: event.id } : formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="E.g., Music, Technology, Business"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter venue location"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
            />
            <p className="text-xs text-gray-500">
              For demo purposes, use URLs from Unsplash or similar services
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="submit">
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EventForm;
