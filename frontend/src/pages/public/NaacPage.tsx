import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/client';
import { Award, FileText, Download, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';

const NaacPage = () => {
  const [activeTab, setActiveTab] = useState('criteria');
  const [criteria, setCriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const res = await apiClient.get('/naac/criteria');
        setCriteria(res.data.data || []);
      } catch (error) {
        console.error('Error fetching NAAC criteria', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCriteria();
  }, []);

  const toggleCriteria = (id: string) => {
    if (expandedCriteria === id) {
      setExpandedCriteria(null);
    } else {
      setExpandedCriteria(id);
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>NAAC | GPPVVS College</title>
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
            NAAC 4th Cycle
          </motion.h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Documents and Criteria for National Assessment and Accreditation Council.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden sticky top-28">
              <div className="p-6 bg-primary-50 border-b border-primary-100">
                <h3 className="font-bold text-primary flex items-center">
                  <Award className="mr-2" size={20} /> Assessment Cycles
                </h3>
              </div>
              <div className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('criteria')}
                  className={`px-6 py-4 text-left font-medium text-sm transition-colors border-l-4 ${activeTab === 'criteria' ? 'bg-surface-50 border-secondary text-primary' : 'border-transparent text-text-secondary hover:bg-surface-50 hover:text-primary'}`}
                >
                  Criteria Wise Documents
                </button>
                <button 
                  onClick={() => setActiveTab('ssr')}
                  className={`px-6 py-4 text-left font-medium text-sm transition-colors border-l-4 ${activeTab === 'ssr' ? 'bg-surface-50 border-secondary text-primary' : 'border-transparent text-text-secondary hover:bg-surface-50 hover:text-primary'}`}
                >
                  Self Study Report (SSR)
                </button>
                <button 
                  onClick={() => setActiveTab('aqar')}
                  className={`px-6 py-4 text-left font-medium text-sm transition-colors border-l-4 ${activeTab === 'aqar' ? 'bg-surface-50 border-secondary text-primary' : 'border-transparent text-text-secondary hover:bg-surface-50 hover:text-primary'}`}
                >
                  Annual Quality Assurance Report (AQAR)
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-surface-200 p-8"
            >
              
              {activeTab === 'criteria' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-4">Criteria Wise Documents</h2>
                  {loading ? (
                    <div className="text-center py-10 text-text-secondary">Loading criteria...</div>
                  ) : criteria.length === 0 ? (
                    <div className="text-center py-10 text-text-secondary">No NAAC criteria found in the database.</div>
                  ) : (
                    <div className="grid gap-4">
                      {criteria.map((crit) => (
                        <div key={crit.id} className="border border-surface-200 rounded-xl overflow-hidden shadow-sm">
                          <div 
                            className="bg-primary-50 p-4 flex items-center justify-between cursor-pointer hover:bg-primary-100 transition-colors"
                            onClick={() => toggleCriteria(crit.id)}
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4 shrink-0 shadow-sm">
                                {crit.number}
                              </div>
                              <h3 className="font-bold text-primary text-lg">{crit.title}</h3>
                            </div>
                            <div className="text-primary p-2">
                              {expandedCriteria === crit.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                          </div>
                          
                          {expandedCriteria === crit.id && (
                            <div className="p-0 bg-white">
                              {crit.documents && crit.documents.length > 0 ? (
                                <ul className="divide-y divide-surface-100">
                                  {crit.documents.map((doc: any, idx: number) => (
                                    <li key={idx} className="p-4 hover:bg-surface-50 transition-colors flex items-center justify-between group">
                                      <div className="flex items-start max-w-[85%]">
                                        <FileText className="text-secondary mt-1 mr-3 shrink-0" size={20} />
                                        <span className="text-text font-medium group-hover:text-primary transition-colors">
                                          {doc.title}
                                        </span>
                                      </div>
                                      <a 
                                        href={doc.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-white bg-primary hover:bg-primary-600 rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm flex items-center shrink-0"
                                      >
                                        <Download size={16} className="mr-2" />
                                        View
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="p-8 text-center text-text-secondary bg-surface-50">
                                  No documents uploaded for this criterion yet.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SSR Tab */}
              {activeTab === 'ssr' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-4">Self Study Report (SSR)</h2>
                  <div className="text-center py-20">
                    <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-text">Reports Available Soon</h3>
                    <p className="text-text-secondary mt-2">The SSR reports are currently being compiled and will be available for download here.</p>
                  </div>
                </div>
              )}

              {/* AQAR Tab */}
              {activeTab === 'aqar' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-4">Annual Quality Assurance Report (AQAR)</h2>
                  <div className="text-center py-20">
                    <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-text">AQAR Documents</h3>
                    <p className="text-text-secondary mt-2">Historical AQAR reports can be uploaded by the administration via the NAAC management portal.</p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NaacPage;
