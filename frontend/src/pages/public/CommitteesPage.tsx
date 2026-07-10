import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/client';
import { Users, ChevronDown, ChevronRight, Shield, Sparkles, Heart, Scale, Megaphone, GraduationCap, Flag, BookHeart } from 'lucide-react';

const committeeIcons: Record<string, any> = {
  'Anti-Ragging Cell': Shield,
  'Entrepreneurship Cell': Sparkles,
  'Placement Cell': GraduationCap,
  'Placement & Career Guidance': GraduationCap,
  'Prevention of Sexual Harassment': Scale,
  'Grievance Redressal Cell': Megaphone,
  'Women Empowerment Cell': Heart,
  'Student Welfare Cell': BookHeart,
  'SC/ST Cell': Users,
  'Research Cell': Sparkles,
  'IPR Cell': Shield,
  'NCC': Flag,
  'NSS': Flag,
  'YRC': Heart,
};

const CommitteesPage = () => {
  const [committees, setCommittees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const res = await apiClient.get('/committees');
        setCommittees(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch committees', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommittees();
  }, []);

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Committees & Cells | GPPVVS College</title>
        <meta name="description" content="Institutional committees, cells, and extension activities at G.P. Porwal Arts, Commerce & V.V. Salimath Science College, Sindagi." />
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
            Committees & Cells
          </motion.h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Institutional committees and cells dedicated to student welfare, research, and community development.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        {loading ? (
          <div className="text-center py-20 text-text-secondary">Loading committees...</div>
        ) : committees.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-200">
            <Users size={48} className="mx-auto text-surface-300 mb-4" />
            <h3 className="text-xl font-bold text-text">No committees found</h3>
            <p className="text-text-secondary mt-2">Committee information will be updated soon.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {committees.map((committee, index) => {
              const Icon = committeeIcons[committee.name] || Users;
              const isExpanded = expandedId === committee.id;

              return (
                <motion.div
                  key={committee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="p-6 flex items-center justify-between cursor-pointer group"
                    onClick={() => setExpandedId(isExpanded ? null : committee.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary mr-5 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                        <Icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors font-heading">
                          {committee.name}
                        </h3>
                        <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                          {committee.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-primary p-2 ml-4 shrink-0">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>

                  {/* Members section */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-surface-200 bg-surface-50 p-6"
                    >
                      <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Committee Members</h4>
                      {committee.members && committee.members.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {committee.members.map((member: any) => (
                            <div key={member.id} className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
                              <div className="font-bold text-text">{member.name}</div>
                              <div className="text-primary text-sm font-semibold mt-0.5">{member.role}</div>
                              {member.designation && <div className="text-text-secondary text-xs mt-0.5">{member.designation}</div>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-text-secondary text-sm bg-white rounded-xl border border-dashed border-surface-300">
                          Committee members will be updated soon.
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteesPage;
