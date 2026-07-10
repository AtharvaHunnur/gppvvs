import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/client';
import { Award, BookOpen, Target, ShieldCheck, User } from 'lucide-react';
const AboutPage = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await apiClient.get('/pages');
        setPages(res.data.data);
      } catch (error) {
        console.error('Error fetching pages', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const getPageContent = (slug: string) => {
    const page = pages.find(p => p.slug === slug);
    return page ? page.content : 'Content not found.';
  };

  const getPageImages = (slug: string) => {
    const page = pages.find(p => p.slug === slug);
    if (!page || !page.images) return [];
    try {
      const parsed = typeof page.images === 'string' ? JSON.parse(page.images) : page.images;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/images')) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Use high-quality default campus images for a premium look
  const defaultCampusImages = [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  ];
  
  let fetchedImages = getPageImages('about-the-institution').map(getImageUrl).filter(url => url && url.length > 5);
  
  const aboutImages = fetchedImages.length > 0 ? fetchedImages : defaultCampusImages;
  const activeImage = aboutImages[activeImageIndex] || defaultCampusImages[0];

  return (
    <div>
      <Helmet>
        <title>About Us | GPPVVS College</title>
      </Helmet>

      {/* Hero Section */}
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
            About the Institution
          </motion.h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Moulding the rural youth for the modern world since 1972.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="space-y-12">
            
            {/* History & Legacy Card */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-surface-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-12 h-1 bg-secondary rounded-full"></span>
                <span className="text-secondary font-bold tracking-widest uppercase text-sm">Since 1972</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-6">A Legacy of Educational Excellence</h2>
              
              <div 
                className="prose prose-lg text-text-secondary text-justify max-w-none"
                dangerouslySetInnerHTML={{ __html: getPageContent('about-the-institution') }}
              />

              {aboutImages.length > 0 && (
                <div className="mt-8 relative aspect-[21/9] rounded-2xl overflow-hidden shadow-md bg-surface-100 border border-surface-200">
                  <img 
                    src={activeImage} 
                    alt="College Campus" 
                    className="w-full h-full object-cover"
                  />
                  {aboutImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                      <button 
                        onClick={() => setActiveImageIndex((prev) => (prev === 0 ? aboutImages.length - 1 : prev - 1))}
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-md transition-colors font-bold"
                      >
                        &#x2190;
                      </button>
                      <button 
                        onClick={() => setActiveImageIndex((prev) => (prev === aboutImages.length - 1 ? 0 : prev + 1))}
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-md transition-colors font-bold"
                      >
                        &#x2192;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Vision & Mission Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary-50 p-8 rounded-3xl border border-primary-100 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition text-primary">
                  <Target size={28} />
                </div>
                <h2 className="text-2xl font-bold text-primary font-heading mb-4">Our Vision</h2>
                <div 
                  className="prose text-text-secondary leading-relaxed text-justify max-w-none"
                  dangerouslySetInnerHTML={{ __html: getPageContent('vision') }}
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-surface-50 p-8 rounded-3xl border border-surface-200 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition text-secondary">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-bold text-primary font-heading mb-4">Our Mission</h2>
                <div 
                  className="prose text-text-secondary leading-relaxed text-justify max-w-none"
                  dangerouslySetInnerHTML={{ __html: getPageContent('mission') }}
                />
              </motion.div>
            </div>

            {/* Principal's Message Card */}
            <section className="bg-primary-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex flex-col md:flex-row gap-10 relative z-10 items-center">
                <div className="md:w-1/3 text-center">
                  <div className="w-40 h-40 rounded-full border-4 border-secondary/30 overflow-hidden mx-auto shadow-xl bg-white">
                    <img src="/images/DMP.jpeg" alt="Prof. D.M. Patil" className="w-full h-full object-cover object-top" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold font-heading">Prof. D.M. Patil</h3>
                  <p className="text-primary-200 text-sm">Principal</p>
                </div>
                <div className="md:w-2/3">
                  <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="text-secondary" size={24} />
                    <h2 className="text-3xl font-bold font-heading">Principal's Desk</h2>
                  </div>
                  <div 
                    className="prose prose-invert prose-lg text-primary-50 text-justify max-w-none"
                    dangerouslySetInnerHTML={{ __html: getPageContent('principals-message') }}
                  />
                </div>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
