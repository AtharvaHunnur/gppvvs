import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { apiClient } from '../../api/client';
import { User, Mail, Search, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const FacultyPage = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facRes, deptRes] = await Promise.all([
          apiClient.get('/faculty'),
          apiClient.get('/departments')
        ]);
        setFaculty(facRes.data.data);
        setDepartments(deptRes.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || f.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Faculty Directory | GPPVVS College</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg">
            Faculty Directory
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Meet our distinguished educators who are dedicated to academic excellence and student success.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search by name or designation..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-surface-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          </div>

          {/* Department Filter */}
          <div className="md:w-1/3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border border-surface-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white appearance-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.program})</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading faculty data...</div>
        ) : filteredFaculty.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-200 shadow-sm">
            <User size={48} className="mx-auto text-surface-300 mb-4" />
            <h3 className="text-xl font-bold text-text mb-2">No faculty found</h3>
            <p className="text-text-secondary">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFaculty.map(member => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={member.id} 
                className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="h-48 bg-primary-50 relative overflow-hidden flex items-center justify-center">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-200 shadow-sm">
                      <User size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-secondary text-primary-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {member.department?.program}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-text mb-1 font-heading group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-4">
                    {member.designation}
                  </p>
                  
                  <div className="space-y-3 mt-auto pt-4 border-t border-surface-100">
                    <div className="flex items-start text-sm text-text-secondary">
                      <BookOpen size={16} className="mr-2 mt-0.5 text-secondary flex-shrink-0" />
                      <span className="line-clamp-2">Dept. of {member.department?.name}</span>
                    </div>
                    {member.specialization && (
                      <div className="flex items-start text-sm text-text-secondary">
                        <GraduationCap size={16} className="mr-2 mt-0.5 text-secondary flex-shrink-0" />
                        <span className="line-clamp-2">{member.specialization}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FacultyPage;
