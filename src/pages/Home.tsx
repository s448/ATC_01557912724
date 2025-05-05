
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useEvents } from '@/contexts/EventContext';
import EventCard from '@/components/Events/EventCard';

const Home = () => {
  const { events } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Extract all unique categories
  const categories = ['All', ...Array.from(new Set(events.map(event => event.category)))];

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || categoryFilter === 'All' || 
                           event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3 text-primary">Discover Amazing Events</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find and book the best events in your area. From tech conferences to music festivals, we've got you covered.
        </p>
      </section>
      
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <Input
            type="search"
            placeholder="Search events..."
            className="max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category === 'All' ? '' : category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === (categoryFilter || 'All')
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
