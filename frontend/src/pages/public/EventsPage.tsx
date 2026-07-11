import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { apiClient } from '../../api/client';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

import { format, isPast } from 'date-fns';
import { getImageUrl } from '../../utils/url';

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const isUpcoming = filter === 'UPCOMING';
        const res = await apiClient.get(`/events?upcoming=${isUpcoming}&limit=20`);
        setEvents(res.data.data);
      } catch (error) {
        console.error('Error fetching events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filter]);

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Campus Events | GPPVVS College</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg">
            Campus Events
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Discover academic seminars, cultural festivals, sports meets, and more happening at our campus.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="flex justify-center space-x-4 mb-12">
          <button 
            onClick={() => setFilter('UPCOMING')}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-sm ${filter === 'UPCOMING' ? 'bg-secondary text-primary-900 shadow-md' : 'bg-white text-text-secondary hover:bg-surface-100 border border-surface-200'}`}
          >
            Upcoming Events
          </button>
          <button 
            onClick={() => setFilter('PAST')}
            className={`px-8 py-3 rounded-full font-bold transition-all shadow-sm ${filter === 'PAST' ? 'bg-primary text-white shadow-md' : 'bg-white text-text-secondary hover:bg-surface-100 border border-surface-200'}`}
          >
            Past Events
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-secondary">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl text-center border border-surface-200 shadow-sm">
            <Calendar size={64} className="mx-auto text-surface-300 mb-4" />
            <h3 className="text-2xl font-bold text-text mb-2">No {filter.toLowerCase()} events</h3>
            <p className="text-text-secondary">Check back later for updates to our campus calendar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-3xl border border-surface-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                <div className="h-48 bg-primary-100 relative overflow-hidden">
                  {event.coverImage ? (
                    <img src={getImageUrl(event.coverImage)} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-100/50">
                      <Calendar size={64} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary font-black px-4 py-2 rounded-xl shadow-lg text-center leading-tight">
                    <span className="block text-2xl">{format(new Date(event.date), 'dd')}</span>
                    <span className="block text-xs uppercase">{format(new Date(event.date), 'MMM')}</span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-text mb-3 font-heading group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-text-secondary mb-6 line-clamp-3 text-sm">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-sm font-medium text-text-secondary">
                      <Clock size={16} className="text-secondary mr-3 flex-shrink-0" />
                      {format(new Date(event.date), 'h:mm a')}
                    </div>
                    <div className="flex items-center text-sm font-medium text-text-secondary">
                      <MapPin size={16} className="text-secondary mr-3 flex-shrink-0" />
                      {event.venue}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-50 p-4 border-t border-surface-200">
                  <button className="w-full flex items-center justify-center text-primary font-bold hover:text-secondary transition-colors">
                    View Details <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
