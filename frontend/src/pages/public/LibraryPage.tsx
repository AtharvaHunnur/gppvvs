import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Star, Layers, Laptop, Image as ImageIcon, Globe, Phone, ChevronRight, FileDown } from 'lucide-react';
import { apiClient } from '../../api/client';

const tabs = [
  { id: 'about', label: 'About Library', icon: BookOpen },
  { id: 'vision', label: 'Vision & Mission', icon: Target },
  { id: 'practices', label: 'Best Practices', icon: Star },
  { id: 'services', label: 'Library Services', icon: Layers },
  { id: 'eresources', label: 'E-Resources', icon: Laptop },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'digital', label: 'Digital Library', icon: Globe },
  { id: 'contact', label: 'Contact', icon: Phone },
];

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [libraryDocuments, setLibraryDocuments] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoadingResources(true);
        // Fetch library documents
        const docsRes = await apiClient.get('/downloads?category=LIBRARY');
        setLibraryDocuments(docsRes.data.data || []);
        
        // Fetch gallery albums to find "library"
        const albumsRes = await apiClient.get('/gallery/albums');
        const albums = albumsRes.data.data || [];
        const libAlbum = albums.find((a: any) => a.slug === 'library');
        
        if (libAlbum) {
          // fetch album images
          const albumRes = await apiClient.get(`/gallery/albums/${libAlbum.id}`);
          setGalleryImages(albumRes.data.data.images || []);
        }
      } catch (error) {
        console.error('Failed to fetch library resources', error);
      } finally {
        setLoadingResources(false);
      }
    };
    fetchResources();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary font-heading mb-4">About Library</h2>
            <p className="text-text-secondary leading-relaxed text-lg text-justify">
              The college library is not a part of college but heart of the institution since 1972 with a collection of 4074 Books at present the central library of the college has a rich collection of 28735 books (volumes) and 22000 titles covering subject like commerce, science, arts, etc. Total area of the library is 4500 sq.ft.
            </p>
            <p className="text-text-secondary leading-relaxed text-lg text-justify">
              It provides a quiet and serene atmosphere for students to read and learn. The library is fully computerized with barcode technology and provides internet access to students and staff.
            </p>
          </div>
        );
      case 'vision':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary font-heading mb-4">Vision & Mission</h2>
            <div className="bg-surface-100 p-8 rounded-2xl border-l-4 border-secondary shadow-sm">
              <h3 className="text-xl font-bold text-text mb-3 flex items-center">
                <Target className="mr-2 text-secondary" size={24} />
                Vision
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                To provide comprehensive resources and services in support of the research, teaching, and learning needs of the college community.
              </p>
            </div>
            <div className="bg-surface-100 p-8 rounded-2xl border-l-4 border-primary shadow-sm">
              <h3 className="text-xl font-bold text-text mb-3 flex items-center">
                <Target className="mr-2 text-primary" size={24} />
                Mission
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                To facilitate access to right information at the right time in the right manner so as to produce productive citizens to this great nation.
              </p>
            </div>
          </div>
        );
      case 'practices':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary font-heading mb-4">Best Practices</h2>
            <div className="bg-white p-6 rounded-2xl border border-surface-200">
              <ul className="space-y-4">
                {[
                  'Book Bank scheme for meritorious students.',
                  'Best User Award for students to encourage reading habits.',
                  'Orientation program for freshers.',
                  'Display of new arrivals on regular basis.',
                  'Dedicated career guidance and competitive exam section.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <Star className="text-secondary mr-3 mt-1 flex-shrink-0" size={20} />
                    <span className="text-text-secondary text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary font-heading mb-4">Library Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Circulation Service', 'Reference Service', 'Reprographic Service', 'Internet Service', 'OPAC (Online Public Access Catalogue)', 'Current Awareness Service'].map((service, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-surface-200 flex items-center group hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Layers size={20} className="text-primary group-hover:text-white" />
                  </div>
                  <span className="font-medium text-text text-lg">{service}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'eresources':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary font-heading mb-4">E-Resources</h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              We provide extensive electronic resources to support academic and research activities, accessible anywhere on campus.
            </p>
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h3 className="text-2xl font-bold mb-4 relative z-10 flex items-center">
                <Laptop className="mr-3" size={28} />
                N-LIST (INFLIBNET)
              </h3>
              <p className="mb-6 text-primary-100 text-lg relative z-10">
                Access a vast repository of 6,000+ e-journals and 1,99,500+ e-books covering all major disciplines.
              </p>
              <a href="#" className="inline-flex items-center bg-secondary text-primary-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors relative z-10">
                Access N-LIST Portal
                <ChevronRight size={18} className="ml-2" />
              </a>
            </div>
          </div>
        );
      case 'gallery':
        const displayImages = galleryImages.length > 0 ? galleryImages : [
          { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80', caption: 'World Book Day Celebration - Reading Books' },
          { url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80', caption: 'World Book Day Celebration - Students viewing books' },
          { url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80', caption: 'World Book Day Celebration - Faculty and students' },
          { url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80', caption: 'Article Publications by Faculty Members' }
        ];
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary font-heading mb-4">Library Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayImages.map((img, i) => (
                <div key={i} className="aspect-[4/3] bg-surface-100 rounded-2xl flex items-center justify-center overflow-hidden relative group border border-surface-200">
                  <img src={img.url} alt={img.caption || 'Library Gallery Image'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {img.caption && (
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-center backdrop-blur-sm p-4 text-center">
                      <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">{img.caption}</span>
                    </div>
                  )}
                  {!img.caption && (
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">View Image</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'digital':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary font-heading mb-4">Digital Library</h2>
            
            {libraryDocuments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {libraryDocuments.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start p-6 bg-white border border-surface-200 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileDown size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text group-hover:text-primary transition-colors text-lg mb-1">{doc.title}</h4>
                      {doc.description && <p className="text-sm text-text-secondary line-clamp-2">{doc.description}</p>}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe size={40} className="text-primary" />
                </div>
                <p className="text-text-secondary leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
                  The digital library section provides comprehensive access to institutional repositories, previous year question papers, syllabus copies, and various open educational resources.
                </p>
                <a
                  href="https://librarian515.wixsite.com/gppvvslibrary"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-600 hover:-translate-y-1 shadow-lg hover:shadow-primary/30 transition-all duration-300"
                >
                  Visit Digital Library Portal
                  <Globe className="ml-3" size={20} />
                </a>
              </div>
            )}
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary font-heading mb-4">Contact Library</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-surface-200">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mr-5 flex-shrink-0">
                  <Phone size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-1">Chief Librarian</h3>
                  <p className="text-text-secondary mb-4">GPPVVS College</p>

                  <div className="space-y-3">
                    <p className="text-text-secondary flex items-center text-lg">
                      <span className="font-medium w-24 text-text">Phone:</span>
                      +91 (08428) XXXXXX
                    </p>
                    <p className="text-text-secondary flex items-center text-lg">
                      <span className="font-medium w-24 text-text">Email:</span>
                      <a href="mailto:library@gppvvs.edu.in" className="text-primary hover:underline">library@gppvvs.edu.in</a>
                    </p>
                    <p className="text-text-secondary flex items-center text-lg">
                      <span className="font-medium w-24 text-text">Timings:</span>
                      9:00 AM to 5:00 PM (Working days)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-24">
      <Helmet>
        <title>Central Library | GPPVVS College</title>
        <meta name="description" content="Central Library of GPPVVS College, Sindagi." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-primary-200 mb-8 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2 text-primary-400" />
            <Link to="/infrastructure" className="hover:text-white transition-colors">Infrastructure</Link>
            <ChevronRight size={14} className="mx-2 text-primary-400" />
            <span className="text-white">Library</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-heading mb-6 drop-shadow-lg"
          >
            Central Library
          </motion.h1>
          <div className="w-24 h-2 bg-gradient-to-r from-secondary to-yellow-500 rounded-full mb-8"></div>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl font-medium leading-relaxed">
            The heart of the institution since 1972, providing a wealth of knowledge and resources to inspire learning and research.
          </p>
        </div>
      </div>

      <div className="container-custom mt-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Tabs Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-md border border-surface-200 overflow-hidden sticky top-24">
              <div className="p-6 bg-primary text-white font-bold text-xl border-b border-primary-800 flex items-center">
                <BookOpen className="mr-3" size={24} />
                Navigation
              </div>
              <div className="flex flex-col">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center w-full text-left px-6 py-4 transition-all duration-300 border-l-[6px] text-lg font-medium group ${isActive
                          ? 'bg-primary-50 border-primary text-primary'
                          : 'bg-white border-transparent text-text-secondary hover:bg-surface-50 hover:text-primary hover:border-primary/30'
                        }`}
                    >
                      <Icon size={20} className={`mr-4 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-surface-400 group-hover:text-primary'}`} />
                      {tab.label}
                      {isActive && (
                        <ChevronRight size={18} className="ml-auto text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-full max-w-4xl">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-md border border-surface-200 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};




export default LibraryPage;
