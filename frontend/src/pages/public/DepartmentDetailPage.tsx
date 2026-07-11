import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { apiClient } from '../../api/client';
import { User, BookOpen, GraduationCap, ArrowLeft, Mail, ChevronRight, Phone, MapPin, Camera, Target, FileText, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../utils/url';

// Fixed tab definitions matching the reference website
const FIXED_TABS = [
  { id: 'about', label: 'About Department', icon: Info },
  { id: 'po', label: 'Programme Outcomes', icon: Target },
  { id: 'pso', label: 'Programme Specific Outcome', icon: FileText },
  { id: 'co', label: 'Course Outcome', icon: BookOpen },
  { id: 'faculty', label: 'Faculty', icon: User },
  { id: 'gallery', label: 'Gallery', icon: Camera },
  { id: 'contact', label: 'Contact', icon: Phone },
];

/**
 * Parses the department description (plain text or HTML) and splits it into
 * sections that map to the fixed tabs above.
 */
const parseDescriptionIntoSections = (raw: string): Record<string, string> => {
  if (!raw || raw.trim().length === 0) return {};

  // Strip HTML tags, decode entities
  const text = raw.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();

  const sections: Record<string, string[]> = {
    about: [],
    po: [],
    pso: [],
    co: [],
  };

  const sectionMarkers: { key: string; patterns: RegExp[] }[] = [
    { key: 'po', patterns: [
      /programme\s+outcomes?\s*:?/i,
      /program\s+outcomes?\s*:?/i,
      /students\s+will\s+have\s+overall/i,
    ]},
    { key: 'pso', patterns: [
      /programme\s+specific\s+outcomes?\s*:?/i,
      /program\s+specific\s+outcomes?\s*:?/i,
      /the\s+study\s+of\s+.*helps\s+students/i,
    ]},
    { key: 'co', patterns: [
      /course\s+outcomes?\s*:?/i,
      /students\s+develop\s+knowledge.*employability/i,
    ]},
  ];

  // Stop parsing about when we hit faculty table rows
  const stopPatterns = [
    /^sl\.?\s*no/i,
    /^profile\s+photo/i,
    /^\d+\s+(dr\.|mr\.|ms\.|mrs\.|shri|smt)/i,
  ];

  const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
  let currentSection = 'about';
  let stopped = false;

  for (const line of lines) {
    if (stopped) break;

    for (const pat of stopPatterns) {
      if (pat.test(line)) { stopped = true; break; }
    }
    if (stopped) break;

    let matched = false;
    for (const marker of sectionMarkers) {
      for (const pattern of marker.patterns) {
        if (pattern.test(line)) {
          currentSection = marker.key;
          matched = true;
          const cleaned = line.replace(pattern, '').trim();
          if (cleaned.length > 10) sections[currentSection].push(cleaned);
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) sections[currentSection].push(line);
  }

  // Convert to clean HTML with bullet-point and sub-header handling
  const result: Record<string, string> = {};
  for (const [key, paras] of Object.entries(sections)) {
    if (paras.length > 0) {
      const html: string[] = [];
      let inList = false;

      for (const p of paras) {
        if (/^[•\-\*]\s*/.test(p)) {
          if (!inList) { html.push('<ul class="list-disc pl-6 space-y-2 my-4 text-text-secondary">'); inList = true; }
          html.push(`<li class="text-justify leading-relaxed">${p.replace(/^[•\-\*]\s*/, '')}</li>`);
        } else {
          if (inList) { html.push('</ul>'); inList = false; }
          if (/^(aims\s+and\s+objectives|strategies|vision|mission)\s*:?\s*$/i.test(p)) {
            html.push(`<h3 class="font-bold text-primary mt-8 mb-3 text-lg border-b border-surface-200 pb-2">${p.replace(/:$/, '')}</h3>`);
          } else {
            html.push(`<p class="mb-4 text-justify leading-relaxed">${p}</p>`);
          }
        }
      }
      if (inList) html.push('</ul>');
      result[key] = html.join('\n');
    }
  }

  return result;
};

const DepartmentDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await apiClient.get(`/departments/${slug}`);
        setDepartment(res.data.data);
      } catch (error) {
        console.error('Failed to fetch department', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDepartment();
  }, [slug]);

  // Reset tab when department changes
  useEffect(() => {
    setActiveTab('about');
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!department) return <div className="min-h-screen flex items-center justify-center text-text-secondary">Department not found.</div>;

  // Parse description into sections
  const parsedSections = parseDescriptionIntoSections(department.description || '');

  // If there's no parsed content for a section, use a placeholder
  const getSectionContent = (key: string): string => {
    return parsedSections[key] || '';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about': {
        const content = getSectionContent('about') || '<p class="text-justify leading-relaxed">Department information will be updated soon.</p>';
        return (
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-surface-200">
            <h2 className="text-2xl font-bold font-heading text-primary mb-6 pb-4 border-b border-surface-200 flex items-center gap-3">
              <Info size={24} className="text-secondary" />
              About the Department
            </h2>
            <div
              className="prose prose-lg max-w-none text-text-secondary leading-relaxed text-justify
                         prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-text-secondary
                         prose-strong:text-primary prose-headings:text-primary"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        );
      }

      case 'po': {
        const content = getSectionContent('po');
        return (
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-surface-200">
            <h2 className="text-2xl font-bold font-heading text-primary mb-6 pb-4 border-b border-surface-200 flex items-center gap-3">
              <Target size={24} className="text-secondary" />
              Programme Outcomes
            </h2>
            {content ? (
              <div
                className="prose prose-lg max-w-none text-text-secondary leading-relaxed text-justify
                           prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-text-secondary"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="text-center py-16">
                <Target size={48} className="mx-auto text-surface-300 mb-4" />
                <p className="text-text-secondary font-medium">Programme outcomes will be updated soon.</p>
                <p className="text-sm text-surface-300 mt-2">Check back later or contact the department for more information.</p>
              </div>
            )}
          </div>
        );
      }

      case 'pso': {
        const content = getSectionContent('pso');
        return (
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-surface-200">
            <h2 className="text-2xl font-bold font-heading text-primary mb-6 pb-4 border-b border-surface-200 flex items-center gap-3">
              <FileText size={24} className="text-secondary" />
              Programme Specific Outcomes
            </h2>
            {content ? (
              <div
                className="prose prose-lg max-w-none text-text-secondary leading-relaxed text-justify
                           prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-text-secondary"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="text-center py-16">
                <FileText size={48} className="mx-auto text-surface-300 mb-4" />
                <p className="text-text-secondary font-medium">Programme specific outcomes will be updated soon.</p>
                <p className="text-sm text-surface-300 mt-2">Check back later or contact the department for more information.</p>
              </div>
            )}
          </div>
        );
      }

      case 'co': {
        const content = getSectionContent('co');
        return (
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-surface-200">
            <h2 className="text-2xl font-bold font-heading text-primary mb-6 pb-4 border-b border-surface-200 flex items-center gap-3">
              <BookOpen size={24} className="text-secondary" />
              Course Outcomes
            </h2>
            {content ? (
              <div
                className="prose prose-lg max-w-none text-text-secondary leading-relaxed text-justify
                           prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-text-secondary"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : department.courses && department.courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="p-4 font-bold text-primary text-sm">Course Name</th>
                      <th className="p-4 font-bold text-primary text-sm">Code</th>
                      <th className="p-4 font-bold text-primary text-sm">Semester</th>
                      <th className="p-4 font-bold text-primary text-sm">Syllabus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200">
                    {department.courses.map((course: any) => (
                      <tr key={course.id} className="hover:bg-surface-50 transition-colors">
                        <td className="p-4 font-medium text-text">{course.name}</td>
                        <td className="p-4 text-text-secondary">{course.code || '-'}</td>
                        <td className="p-4 text-text-secondary">{course.semester || '-'}</td>
                        <td className="p-4">
                          {course.syllabusUrl ? (
                            <a href={course.syllabusUrl} target="_blank" rel="noreferrer" className="text-primary font-medium hover:text-secondary transition-colors">Download</a>
                          ) : (
                            <span className="text-text-secondary">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen size={48} className="mx-auto text-surface-300 mb-4" />
                <p className="text-text-secondary font-medium">Course outcomes will be updated soon.</p>
              </div>
            )}
          </div>
        );
      }

      case 'faculty':
        return (
          <div>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-surface-200 mb-6">
              <h2 className="text-2xl font-bold font-heading text-primary mb-2 flex items-center gap-3">
                <User size={24} className="text-secondary" />
                Faculty Members
              </h2>
              <p className="text-text-secondary text-sm">
                {department.faculty?.length || 0} faculty member{department.faculty?.length !== 1 ? 's' : ''} in the Department of {department.name}
              </p>
            </div>
            {department.faculty && department.faculty.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-surface-200">
                <table className="w-full text-left">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="p-4 font-bold text-primary text-sm w-12">Sl.No</th>
                      <th className="p-4 font-bold text-primary text-sm w-16">Photo</th>
                      <th className="p-4 font-bold text-primary text-sm">Name</th>
                      <th className="p-4 font-bold text-primary text-sm">Qualification</th>
                      <th className="p-4 font-bold text-primary text-sm">Specialization</th>
                      <th className="p-4 font-bold text-primary text-sm">Designation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200">
                    {department.faculty.map((member: any, idx: number) => (
                      <tr key={member.id} className="hover:bg-surface-50 transition-colors">
                        <td className="p-4 text-text-secondary font-medium">{idx + 1}</td>
                        <td className="p-4">
                          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary overflow-hidden">
                            {member.photo ? (
                              <img src={getImageUrl(member.photo)} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-text">{member.name}</td>
                        <td className="p-4 text-text-secondary">{member.qualification || '-'}</td>
                        <td className="p-4 text-text-secondary">{member.specialization || '-'}</td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 bg-primary-50 text-primary text-xs font-bold rounded-full">
                            {member.designation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-16 rounded-2xl shadow-sm border border-surface-200 text-center">
                <User size={48} className="mx-auto text-surface-300 mb-4" />
                <p className="text-text-secondary font-medium">Faculty details will be updated soon.</p>
              </div>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-surface-200">
            <h2 className="text-2xl font-bold font-heading text-primary mb-6 pb-4 border-b border-surface-200 flex items-center gap-3">
              <Camera size={24} className="text-secondary" />
              Department Gallery
            </h2>
            <div className="text-center py-16">
              <Camera size={48} className="mx-auto text-surface-300 mb-4" />
              <p className="text-text-secondary font-medium">Gallery images will be updated soon.</p>
              <Link to="/gallery" className="mt-4 inline-flex items-center text-primary font-bold hover:text-secondary transition-colors">
                View College Gallery <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-surface-200">
            <h2 className="text-2xl font-bold font-heading text-primary mb-6 pb-4 border-b border-surface-200 flex items-center gap-3">
              <Phone size={24} className="text-secondary" />
              Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text mb-1">Address</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Department of {department.name}<br />
                      G.P. Porwal Arts, Commerce & V.V. Salimath Science College<br />
                      Vijayapur Road, Sindagi - 586128<br />
                      Dist: Vijayapura, Karnataka
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text mb-1">Phone</h4>
                    <p className="text-text-secondary text-sm">Office: (08488) 221244</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text mb-1">Email</h4>
                    <p className="text-text-secondary text-sm">principal@gppvvs.ac.in</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-50 rounded-xl p-6 border border-surface-200">
                <h4 className="font-bold text-primary mb-4">Head of Department</h4>
                {department.faculty && department.faculty.length > 0 ? (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center overflow-hidden">
                      {department.faculty[0].photo ? (
                        <img src={getImageUrl(department.faculty[0].photo)} alt={department.faculty[0].name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={28} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-text">{department.faculty[0].name}</div>
                      <div className="text-primary text-sm font-medium">{department.faculty[0].designation}</div>
                      <div className="text-text-secondary text-xs mt-1">{department.faculty[0].qualification}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">Contact information will be updated soon.</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>{department.name} | GPPVVS College</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom relative z-10">
          <Link to="/departments" className="inline-flex items-center text-primary-200 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" /> Back to Departments
          </Link>
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg">Department of {department.name}</h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 rounded-full mb-6"></div>
          <div className="flex items-center space-x-4">
            <span className="bg-secondary text-primary-900 px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">{department.program}</span>
          </div>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left Sidebar - Fixed Tab Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden sticky top-24">
              <div className="bg-primary p-4">
                <h3 className="text-white font-bold font-heading text-lg">{department.name}</h3>
              </div>
              <nav className="divide-y divide-surface-100">
                {FIXED_TABS.map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-all flex items-center gap-3 group ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary border-l-4 border-primary font-bold'
                          : 'text-text-secondary hover:bg-surface-50 hover:text-primary border-l-4 border-transparent'
                      }`}
                    >
                      <IconComp size={16} className={activeTab === tab.id ? 'text-secondary' : 'text-surface-300 group-hover:text-primary'} />
                      <span className="flex-1">{tab.label}</span>
                      <ChevronRight size={14} className={`transition-transform ${activeTab === tab.id ? 'text-primary' : 'text-surface-300 group-hover:text-primary'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
