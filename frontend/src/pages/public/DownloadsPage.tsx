import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { apiClient } from '../../api/client';
import { Download, FileText, Search, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await apiClient.get('/downloads');
        setDownloads(res.data.data);
      } catch (error) {
        console.error('Failed to fetch downloads', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(downloads.map(d => d.category)))];

  const filteredDownloads = downloads.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || d.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Downloads & Resources | GPPVVS College</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg">
            Downloads & Resources
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Access forms, syllabus, academic calendars, and other important documents.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-surface-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-4 rounded-xl font-bold whitespace-nowrap transition shadow-sm ${
                  activeCategory === cat 
                  ? 'bg-secondary text-primary-900 border border-secondary' 
                  : 'bg-white text-text-secondary hover:bg-surface-100 border border-surface-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-text-secondary">Loading documents...</div>
          ) : filteredDownloads.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={64} className="mx-auto text-surface-300 mb-4" />
              <h3 className="text-2xl font-bold text-text mb-2">No documents found</h3>
              <p className="text-text-secondary">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-200">
              {filteredDownloads.map((doc, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={doc.id} 
                  className="p-6 hover:bg-surface-50 transition-colors flex flex-col md:flex-row md:items-center gap-6 group"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileDown size={32} />
                  </div>
                  <div className="flex-grow">
                    <span className="inline-block px-2 py-1 bg-surface-200 text-text-secondary text-[10px] font-bold rounded mb-2 uppercase tracking-wider">
                      {doc.category}
                    </span>
                    <h3 className="text-xl font-bold text-text mb-1 group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-xl font-bold transition shadow-sm w-full md:w-auto"
                    >
                      <Download size={18} className="mr-2" /> Download
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DownloadsPage;
