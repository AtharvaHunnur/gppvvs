import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/client';
import { FileText, ArrowLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../../utils/url';
import PublicDocumentList from '../../components/public/PublicDocumentList';

const PageViewerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/pages/${slug}`);
        if (res.data.success) {
          setPage(res.data.data);
        } else {
          setError('Page not found');
        }
      } catch (err) {
        console.error('Failed to fetch page:', err);
        setError('Page not found or an error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  const getPageImages = () => {
    if (!page || !page.images) return [];
    try {
      const parsed = typeof page.images === 'string' ? JSON.parse(page.images) : page.images;
      return Array.isArray(parsed) ? parsed.map(getImageUrl).filter((u: string) => u && u.length > 5) : [];
    } catch (e) {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary font-medium">Loading page content...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-lg border border-surface-200 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={36} className="text-surface-400" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-3 font-heading">Page Not Found</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            The page you are looking for (<span className="font-mono text-sm bg-surface-100 px-2 py-0.5 rounded">{slug}</span>) does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-full bg-primary text-white py-3.5 px-4 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const images = getPageImages();

  // Context-aware logic
  const INFRASTRUCTURE_SLUGS = [
    'library', 'labs', 'function-hall', 'play-ground',
    'indoor-stadium', 'multi-gym', 'womens-hostel',
    'online-classes', 'facilities',
    'green-library', 'language-lab', 'museum', 'ladies-rest-room'
  ];
  
  const ABOUT_SLUGS = [
    'about-the-institution', 'vision', 'mission', 'principals-message', 'trustees'
  ];

  let sectionName = 'Page';
  let sectionUrl = '/';
  
  if (slug && INFRASTRUCTURE_SLUGS.includes(slug)) {
    sectionName = 'Infrastructure';
    sectionUrl = '/infrastructure';
  } else if (slug && ABOUT_SLUGS.includes(slug)) {
    sectionName = 'About Us';
    sectionUrl = '/page/about-the-institution'; // fallback to main about page
  } else if (slug && (slug.startsWith('examination-') || slug === 'examinations')) {
    sectionName = 'Student Corner';
    sectionUrl = '/student-corner';
  } else if (slug === 'admissions') {
    sectionName = 'Admissions';
    sectionUrl = '/page/admissions';
  }

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>{page.title} | GPPVVS College</title>
        <meta name="description" content={`Learn about ${page.title} at GPPVVS College, Sindagi.`} />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-primary-200 mb-6 flex-wrap gap-y-2">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2 text-primary-400" />
            <Link to={sectionUrl} className="hover:text-white transition-colors">{sectionName}</Link>
            <ChevronRight size={14} className="mx-2 text-primary-400" />
            <span className="text-white font-medium">{page.title}</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg"
          >
            {page.title}
          </motion.h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 rounded-full"></div>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className={`grid grid-cols-1 ${images.length > 0 || sectionName === 'Infrastructure' ? 'lg:grid-cols-3' : ''} gap-10`}>
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={images.length > 0 || sectionName === 'Infrastructure' ? 'lg:col-span-2' : ''}
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-surface-200">
              <div 
                className="prose prose-lg max-w-none text-justify prose-headings:font-heading prose-headings:font-bold prose-h2:text-2xl prose-h2:text-primary prose-h2:mb-4 prose-h3:text-xl prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-secondary prose-a:font-bold hover:prose-a:text-primary prose-li:text-text-secondary prose-strong:text-text prose-img:rounded-xl prose-img:shadow-md prose-ul:space-y-1"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>

            {/* Back link */}
            <div className="mt-8">
              <Link 
                to={sectionUrl} 
                className="inline-flex items-center text-primary font-bold hover:text-secondary transition-colors group bg-white px-6 py-3 rounded-xl shadow-sm border border-surface-200"
              >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to {sectionName}
              </Link>
            </div>

            {/* Documents Section */}
            <PublicDocumentList section="pages" entityId={page.id} title="Page Documents" />
          </motion.div>

          {/* Sidebar Area */}
          {(images.length > 0 || sectionName === 'Infrastructure' || sectionName === 'About Us') && (
            <div className="lg:col-span-1 space-y-6">
              
              {/* Sibling Navigation Menu */}
              {sectionName === 'Infrastructure' && (
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                  <div className="bg-primary px-6 py-4">
                    <h3 className="font-bold text-white text-lg">Facilities</h3>
                  </div>
                  <div className="divide-y divide-surface-100">
                    {INFRASTRUCTURE_SLUGS.map((s) => (
                      <Link 
                        key={s}
                        to={`/page/${s}`}
                        className={`block px-6 py-3 text-sm font-medium transition-colors ${slug === s ? 'bg-primary-50 text-primary border-l-4 border-primary' : 'text-text hover:bg-surface-50 hover:text-primary border-l-4 border-transparent'}`}
                      >
                        {s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {sectionName === 'About Us' && (
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                  <div className="bg-primary px-6 py-4">
                    <h3 className="font-bold text-white text-lg">About Us</h3>
                  </div>
                  <div className="divide-y divide-surface-100">
                    {ABOUT_SLUGS.map((s) => (
                      <Link 
                        key={s}
                        to={`/page/${s}`}
                        className={`block px-6 py-3 text-sm font-medium transition-colors ${slug === s ? 'bg-primary-50 text-primary border-l-4 border-primary' : 'text-text hover:bg-surface-50 hover:text-primary border-l-4 border-transparent'}`}
                      >
                        {s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              {images.length > 0 && images.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="bg-white p-3 rounded-2xl shadow-sm border border-surface-200 overflow-hidden group"
                >
                  <img
                    src={img}
                    alt={`${page.title} - Image ${idx + 1}`}
                    className="w-full h-auto rounded-xl object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageViewerPage;
