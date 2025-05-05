
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '@/components/Events/EventForm';
import { useEvents } from '@/contexts/EventContext';

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const { getEvent, updateEvent } = useEvents();
  const navigate = useNavigate();
  
  const event = getEvent(id || '');
  
  if (!event) {
    navigate('/admin');
    return null;
  }
  
  const handleSubmit = (eventData: any) => {
    updateEvent(eventData);
    navigate('/admin');
  };
  
  return (
    <div className="container mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Modify the details of your event
        </p>
      </div>
      
      <EventForm 
        onSubmit={handleSubmit}
        event={event}
        title="Event Details"
      />
    </div>
  );
};

export default EditEvent;
