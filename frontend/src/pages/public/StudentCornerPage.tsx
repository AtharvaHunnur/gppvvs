import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileDown, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';

const StudentCornerPage = () => {
  const sections = [
    {
      title: 'Downloads',
      description: 'Access academic calendars, syllabus copies, previous year question papers, and essential forms.',
      icon: FileDown,
      link: '/downloads',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Committees & Cells',
      description: 'Explore various student committees like Anti-Ragging, NSS, NCC, and Women Empowerment cells.',
      icon: Users,
      link: '/committees',
      color: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Examinations',
      description: 'View exam timetables, guidelines, result announcements, and academic regulations.',
      icon: BookOpen,
      link: '/page/examinations', // Can be a single page or a list page
      color: 'from-purple-500 to-fuchsia-600'
    }
  ];

  return (
    <div className="bg-surface-50 min-h-screen pb-24">
      <Helmet>
        <title>Student Corner | GPPVVS College</title>
        <meta name="description" content="Access essential resources, committees, and examination details for students at GPPVVS College." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
          >
            <GraduationCap size={40} className="text-secondary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg"
          >
            Student Corner
          </motion.h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Your central hub for academic resources, co-curricular activities, and examination updates.
          </p>
        </div>
      </div>

      <div className="container-custom mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={section.link}
                  className="block bg-white rounded-3xl overflow-hidden shadow-md border border-surface-200 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col"
                >
                  <div className={`relative h-40 bg-gradient-to-br ${section.color} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Icon size={32} className="text-white drop-shadow-md" />
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-text font-heading mb-3 group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                      {section.description}
                    </p>
                    <div className="flex items-center text-primary font-bold group-hover:text-secondary transition-colors uppercase tracking-wider text-sm mt-auto">
                      Explore
                      <ChevronRight size={18} className="ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentCornerPage;
