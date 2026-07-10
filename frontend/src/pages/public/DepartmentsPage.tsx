import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/client';
import { BookOpen, Users, ChevronRight, Beaker, Calculator, Landmark, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

const programIcons: Record<string, any> = {
  BA: Landmark,
  BSC: Beaker,
  BCOM: Calculator,
  BCA: MonitorPlay,
};

const programTitles: Record<string, string> = {
  BA: 'Bachelor of Arts (B.A.)',
  BSC: 'Bachelor of Science (B.Sc)',
  BCOM: 'Bachelor of Commerce (B.Com)',
  BCA: 'Bachelor of Computer Applications (BCA)',
};

const stripHtml = (html: string) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get('/departments');
        setDepartments(res.data.data);
      } catch (error) {
        console.error('Error fetching departments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const programs = ['ALL', 'BA', 'BCOM', 'BSC', 'BCA'];
  
  const filteredDepartments = activeFilter === 'ALL' 
    ? departments 
    : departments.filter(d => d.program === activeFilter);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Academic Departments | GPPVVS College</title>
      </Helmet>

      {/* Page Header */}
      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg">
            Academic Departments
          </motion.h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Explore our comprehensive range of undergraduate programs designed to foster excellence and innovation.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {programs.map((prog) => (
            <button
              key={prog}
              onClick={() => setActiveFilter(prog)}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-sm ${
                activeFilter === prog 
                ? 'bg-secondary text-primary-900 shadow-md scale-105' 
                : 'bg-white text-text-secondary hover:bg-primary-50 hover:text-primary'
              }`}
            >
              {prog === 'ALL' ? 'All Departments' : programTitles[prog]}
            </button>
          ))}
        </div>

        {/* Departments Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredDepartments.map((dept, index) => {
            const Icon = programIcons[dept.program] || BookOpen;
            
            return (
              <Link
                to={`/departments/${dept.slug}`}
                key={dept.id}
              >
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full"
              >
                <div className="p-8 flex-grow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon size={28} />
                    </div>
                    <span className="px-3 py-1 bg-surface-100 text-xs font-bold text-text-secondary rounded-full uppercase tracking-wider">
                      {dept.program}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-text mb-3 font-heading group-hover:text-primary transition-colors">
                    Dept. of {dept.name}
                  </h3>
                  
                  <p className="text-text-secondary line-clamp-3 mb-6">
                    {stripHtml(dept.description)}
                  </p>
                </div>

                <div className="px-8 py-4 bg-surface-50 border-t border-surface-200 mt-auto flex justify-between items-center group-hover:bg-primary-50 transition-colors">
                  <div className="flex items-center text-sm font-medium text-text-secondary">
                    <Users size={16} className="mr-2" /> View Details
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-200">
            <BookOpen size={48} className="mx-auto text-surface-200 mb-4" />
            <h3 className="text-xl font-bold text-text">No departments found</h3>
            <p className="text-text-secondary">Try selecting a different program filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
