import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ExternalLink, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { apiClient } from '../../api/client';
import { format } from 'date-fns';

const Sidebar = () => {
  const [quickLinks, setQuickLinks] = useState<any[]>([]);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [linksRes, noticesRes] = await Promise.all([
          apiClient.get('/homepage/quicklinks'),
          apiClient.get('/notices?limit=5')
        ]);
        
        // Only show visible links and sort by position
        const visibleLinks = (linksRes.data.data || [])
          .filter((link: any) => link.isVisible)
          .sort((a: any, b: any) => a.position - b.position);
          
        setQuickLinks(visibleLinks);
        
        // Take top 4 recent notices
        const notices = (noticesRes.data.data || []).slice(0, 4);
        setRecentNotices(notices);
      } catch (error) {
        console.error('Failed to fetch sidebar data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSidebarData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Quick Links Widget */}
      <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-0 opacity-50"></div>
        <div className="p-6 relative z-10 border-b border-surface-100 flex items-center justify-between">
          <h3 className="text-xl font-bold font-heading text-primary flex items-center">
            <ExternalLink className="mr-2 text-secondary" size={24} />
            Quick Links
          </h3>
        </div>
        <div className="p-2 relative z-10">
          {quickLinks.length > 0 ? (
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-50 text-text hover:text-primary transition-colors group"
                  >
                    <ChevronRight size={16} className="text-secondary mr-2 group-hover:translate-x-1 transition-transform" />
                    <span className="font-medium">{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-sm text-text-secondary text-center">
              No quick links available.
            </div>
          )}
        </div>
      </div>

      {/* Latest Notices Widget */}
      <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden relative">
        <div className="p-6 relative z-10 border-b border-surface-100 flex items-center justify-between">
          <h3 className="text-xl font-bold font-heading text-primary flex items-center">
            <Bell className="mr-2 text-secondary" size={24} />
            Announcements
          </h3>
        </div>
        <div className="relative z-10 p-2">
          {recentNotices.length > 0 ? (
            <div className="divide-y divide-surface-100">
              {recentNotices.map((notice) => (
                <Link 
                  key={notice.id} 
                  to="/notices"
                  className="flex p-4 hover:bg-surface-50 transition-colors group rounded-xl"
                >
                  <div className="flex-shrink-0 mr-4 text-center">
                    <div className="bg-primary-50 text-primary rounded-lg p-2 min-w-[3.5rem] group-hover:bg-primary group-hover:text-white transition-colors">
                      <div className="text-lg font-black leading-none">{format(new Date(notice.createdAt), 'dd')}</div>
                      <div className="text-[10px] font-bold uppercase mt-1">{format(new Date(notice.createdAt), 'MMM')}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors line-clamp-2">
                      {notice.title}
                    </h4>
                    {notice.category && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-surface-200 text-text-secondary text-[9px] font-bold rounded uppercase">
                        {notice.category}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-sm text-text-secondary text-center">
              No recent announcements.
            </div>
          )}
          <div className="p-2">
            <Link 
              to="/notices" 
              className="block text-center text-sm font-bold text-primary hover:text-secondary p-3 transition-colors rounded-xl hover:bg-primary-50"
            >
              View All Notices
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Banner */}
      <div className="bg-primary text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border-b-4 border-secondary">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary opacity-20 rounded-full blur-2xl"></div>
        
        <h3 className="text-2xl font-bold font-heading mb-2 relative z-10">Need Help?</h3>
        <p className="text-primary-100 text-sm mb-6 relative z-10">
          Reach out to our administration for any inquiries or support.
        </p>
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-start">
            <Phone size={18} className="text-secondary mt-0.5 mr-3 shrink-0" />
            <div className="text-sm font-medium">08488-221244</div>
          </div>
          <div className="flex items-start">
            <Mail size={18} className="text-secondary mt-0.5 mr-3 shrink-0" />
            <div className="text-sm font-medium">gpprincipal@gmail.com</div>
          </div>
          <div className="flex items-start">
            <MapPin size={18} className="text-secondary mt-0.5 mr-3 shrink-0" />
            <div className="text-sm font-medium">
              G.P. Porwal College,<br />
              Sindagi - 586128
            </div>
          </div>
        </div>
        
        <Link 
          to="/contact"
          className="mt-6 inline-block w-full text-center bg-white text-primary font-bold py-3 rounded-xl hover:bg-surface-50 transition-colors shadow-sm"
        >
          Contact Us
        </Link>
      </div>
      
    </div>
  );
};

export default Sidebar;
