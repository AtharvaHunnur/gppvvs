import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { apiClient } from '../api/client';

const AnnouncementTicker = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await apiClient.get('/notices?limit=5');
        const pinned = (res.data.data || []).filter((n: any) => n.isPinned);
        setAnnouncements(pinned.length > 0 ? pinned : res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch announcements', error);
      }
    };
    fetchNotices();
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="bg-white shadow-md border-t-4 border-b-4 border-secondary overflow-hidden relative z-30">
      <div className="flex h-12">
        <div className="bg-secondary text-primary-900 font-bold uppercase tracking-wider flex items-center px-6 h-full flex-shrink-0 z-10 whitespace-nowrap shadow-md">
          <Megaphone className="w-5 h-5 mr-2" />
          Announcements
        </div>
        <div className="flex-grow flex items-center overflow-hidden bg-white/95">
          <div className="flex animate-marquee whitespace-nowrap">
            {announcements.map((item, idx) => (
              <span key={item.id} className="mx-8 flex items-center text-primary-900 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-secondary mr-3 animate-pulse"></span>
                {item.title}
                <Link to="/notices" className="ml-3 text-secondary hover:text-primary hover:underline transition-colors font-bold text-xs uppercase tracking-wider">
                  View...
                </Link>
                {idx !== announcements.length - 1 && <span className="mx-8 text-surface-300">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementTicker;
