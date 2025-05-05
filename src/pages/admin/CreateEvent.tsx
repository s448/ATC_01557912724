
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '@/components/Events/EventForm';
import { useEvents } from '@/contexts/EventContext';

const CreateEvent = () => {
  const { addEvent } = useEvents();
  const navigate = useNavigate();
  
  const handleSubmit = (eventData: any) => {
    addEvent(eventData);
    navigate('/admin');
  };
  
  return (
    <div className="container mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Event</h1>
        <p className="text-gray-600 dark:text-gray-300">Add a new event to your platform</p>
      </div>
      
      <EventForm 
        onSubmit={handleSubmit}
        title="Event Details"
      />
    </div>
  );
};

export default CreateEvent;
