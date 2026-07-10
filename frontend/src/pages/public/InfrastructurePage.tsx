import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/client';
import { Building2, BookOpen, FlaskConical, Presentation, Trees, Trophy, Dumbbell, Home, Wifi, Landmark, ChevronRight } from 'lucide-react';

// Icon + gradient color per slug for visually distinct cards
const cardMeta: Record<string, { icon: any; gradient: string; accent: string }> = {
  'library':        { icon: BookOpen,     gradient: 'from-amber-500 to-orange-600',   accent: 'bg-amber-500' },
  'labs':           { icon: FlaskConical, gradient: 'from-blue-500 to-indigo-600',     accent: 'bg-blue-500' },
  'function-hall':  { icon: Presentation, gradient: 'from-purple-500 to-fuchsia-600',  accent: 'bg-purple-500' },
  'play-ground':    { icon: Trees,        gradient: 'from-emerald-500 to-green-600',   accent: 'bg-emerald-500' },
  'indoor-stadium': { icon: Trophy,       gradient: 'from-rose-500 to-red-600',        accent: 'bg-rose-500' },
  'multi-gym':      { icon: Dumbbell,     gradient: 'from-cyan-500 to-teal-600',       accent: 'bg-cyan-500' },
  'womens-hostel':  { icon: Home,         gradient: 'from-pink-500 to-rose-600',       accent: 'bg-pink-500' },
  'online-classes': { icon: Wifi,         gradient: 'from-violet-500 to-purple-600',   accent: 'bg-violet-500' },
  'facilities':     { icon: Landmark,     gradient: 'from-teal-500 to-emerald-600',    accent: 'bg-teal-500' },
};

const infrastructureSlugs = [
  'library', 'labs', 'function-hall', 'play-ground',
  'indoor-stadium', 'multi-gym', 'womens-hostel',
  'online-classes', 'facilities'
];

/** Strip HTML tags and return plain text */
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/** Remove the first <h2>…</h2> from content since we already show the title */
function stripFirstHeading(html: string): string {
  return html.replace(/<h2[^>]*>.*?<\/h2>/i, '').trim();
}

const InfrastructurePage = () => {
  const [infraPages, setInfraPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfra = async () => {
      try {
        const res = await apiClient.get('/pages');
        if (res.data.success) {
          const allPages = res.data.data;
          const matched = infrastructureSlugs
            .map(slug => allPages.find((p: any) => p.slug === slug))
            .filter(Boolean);
          setInfraPages(matched);
        }
      } catch (error) {
        console.error('Failed to fetch infrastructure pages', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfra();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium">Loading infrastructure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 min-h-screen pb-24">
      <Helmet>
        <title>Campus Infrastructure | GPPVVS College</title>
        <meta name="description" content="Explore the world-class infrastructure at GPPVVS College — Library, Laboratories, Function Hall, Playground, Indoor Stadium, Multi-Gym, Hostel, and more." />
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
            Campus Infrastructure
          </motion.h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            State-of-the-art facilities designed to provide a holistic and enriching learning environment.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container-custom mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {infraPages.map((item, index) => {
            const meta = cardMeta[item.slug] || cardMeta['facilities'];
            const Icon = meta.icon;
            const description = stripHtml(stripFirstHeading(item.content));

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <Link
                  to={`/page/${item.slug}`}
                  className="block bg-white rounded-3xl overflow-hidden shadow-md border border-surface-200 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col"
                >
                  {/* Gradient header with icon */}
                  <div className={`relative h-44 bg-gradient-to-br ${meta.gradient} flex items-center justify-center overflow-hidden`}>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full"></div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500 shadow-lg">
                        <Icon size={36} className="text-white drop-shadow-md" />
                      </div>
                    </div>

                    {/* Bottom accent stripe */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
                  </div>

                  {/* Content area */}
                  <div className="p-7 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-text font-heading mb-3 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-grow line-clamp-4">
                      {description}
                    </p>

                    <div className="flex items-center text-primary font-bold text-sm group-hover:text-secondary transition-colors uppercase tracking-wider mt-auto">
                      Learn More
                      <ChevronRight size={18} className="ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {infraPages.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-surface-200">
            <Building2 size={48} className="mx-auto text-surface-300 mb-4" />
            <h3 className="text-xl font-bold text-text mb-2">No Infrastructure Information Available</h3>
            <p className="text-text-secondary">Infrastructure content is currently being updated.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfrastructurePage;
