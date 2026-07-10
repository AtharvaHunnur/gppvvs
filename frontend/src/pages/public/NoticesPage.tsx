import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/client';
import { Bell, Pin, Calendar, ChevronRight, Search } from 'lucide-react';
import { format } from 'date-fns';

const NoticesPage = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await apiClient.get('/notices?limit=50');
        setNotices(res.data.data);
      } catch (error) {
        console.error('Error fetching notices', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const categories = ['ALL', 'GENERAL', 'ACADEMIC', 'EXAM', 'ADMISSION', 'PLACEMENT'];
  
  const filteredNotices = activeCategory === 'ALL' 
    ? notices 
    : notices.filter(n => n.category === activeCategory);

  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const regularNotices = filteredNotices.filter(n => !n.isPinned);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Notices & Announcements | GPPVVS College</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg"
          >
            Notices & Announcements
          </motion.h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8 font-medium">
            Stay updated with the latest circulars, examination schedules, and institutional news.
          </p>

          <div className="max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Search notices..." 
              className="w-full pl-12 pr-4 py-4 rounded-full text-text focus:outline-none focus:ring-4 focus:ring-secondary/50 transition shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          </div>
        </div>
      </div>

      <div className="container-custom mt-12">
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-bold text-xs transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-text-secondary hover:bg-surface-200 border border-surface-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
          
          {pinnedNotices.length > 0 && (
            <div className="bg-primary-50/50">
              <div className="px-8 py-4 border-b border-primary-100 flex items-center text-primary font-bold text-sm uppercase tracking-wider">
                <Pin size={16} className="mr-2" /> Pinned Announcements
              </div>
              <div className="divide-y divide-primary-100">
                {pinnedNotices.map(notice => (
                  <div key={notice.id} className="p-8 hover:bg-white transition-colors flex flex-col md:flex-row md:items-center gap-6 group">
                    <div className="flex-shrink-0 text-center bg-primary-100 text-primary rounded-xl p-3 w-20">
                      <div className="text-2xl font-black">{format(new Date(notice.createdAt), 'dd')}</div>
                      <div className="text-xs font-bold uppercase">{format(new Date(notice.createdAt), 'MMM yyyy')}</div>
                    </div>
                    <div className="flex-grow">
                      <span className="inline-block px-2 py-1 bg-secondary text-primary-900 text-[10px] font-bold rounded mb-2">
                        {notice.category}
                      </span>
                      <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors mb-2">
                        {notice.title}
                      </h3>
                      {notice.content && <p className="text-text-secondary text-sm line-clamp-2">{notice.content}</p>}
                    </div>
                    <div className="flex-shrink-0">
                      <button className="flex items-center text-primary font-medium hover:text-secondary transition-colors">
                        Read More <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-8 py-4 border-b border-surface-200 flex items-center text-text-secondary font-bold text-sm uppercase tracking-wider bg-surface-50">
            <Calendar size={16} className="mr-2" /> Recent Notices
          </div>
          <div className="divide-y divide-surface-200">
            {regularNotices.length > 0 ? regularNotices.map(notice => (
              <div key={notice.id} className="p-8 hover:bg-surface-50 transition-colors flex flex-col md:flex-row md:items-center gap-6 group">
                <div className="flex-shrink-0 text-center border-2 border-surface-200 text-text-secondary rounded-xl p-3 w-20 group-hover:border-primary group-hover:text-primary transition-colors">
                  <div className="text-2xl font-black">{format(new Date(notice.createdAt), 'dd')}</div>
                  <div className="text-xs font-bold uppercase">{format(new Date(notice.createdAt), 'MMM yyyy')}</div>
                </div>
                <div className="flex-grow">
                  <span className="inline-block px-2 py-1 bg-surface-200 text-text-secondary text-[10px] font-bold rounded mb-2">
                    {notice.category}
                  </span>
                  <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors mb-2">
                    {notice.title}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <button className="flex items-center text-text-secondary font-medium group-hover:text-primary transition-colors">
                    View <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-text-secondary">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                <p>No recent notices found for this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
