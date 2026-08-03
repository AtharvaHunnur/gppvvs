import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { FileText, Save, Edit2, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';
import ImageUploadField from '../../components/admin/ImageUploadField';

const ABOUT_SLUGS = [
  { slug: 'about-the-institution', label: 'About the Institution' },
  { slug: 'vision', label: 'Vision' },
  { slug: 'mission', label: 'Mission' },
  { slug: 'principals-message', label: 'Principal\'s Message' },
  { slug: 'trustees', label: 'Trustees' }
];

const AboutAdminPage = () => {
  const [activeTab, setActiveTab] = useState(ABOUT_SLUGS[0].slug);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPageContent(activeTab);
  }, [activeTab]);

  const fetchPageContent = async (slug: string) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get(`/pages/${slug}`);
      if (res.data.success && res.data.data) {
        const page = res.data.data;
        setPageData(page);
        setTitle(page.title || '');
        setContent(page.content || '');
        if (page.images) {
          try {
            const parsed = typeof page.images === 'string' ? JSON.parse(page.images) : page.images;
            setImages(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setImages([]);
          }
        } else {
          setImages([]);
        }
      } else {
        // Page not found, reset form for creation
        setPageData(null);
        setTitle(ABOUT_SLUGS.find(s => s.slug === slug)?.label || '');
        setContent('');
        setImages([]);
      }
    } catch (error) {
      console.error('Failed to fetch page', error);
      // Assume 404, prepare for creation
      setPageData(null);
      setTitle(ABOUT_SLUGS.find(s => s.slug === slug)?.label || '');
      setContent('');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type: string, text: string) => { 
    setMessage({ type, text }); 
    setTimeout(() => setMessage({ type: '', text: '' }), 5000); 
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        slug: activeTab,
        content,
        images: JSON.stringify(images),
        isPublished: true
      };

      if (pageData && pageData.id) {
        // Update existing
        await apiClient.put(`/pages/${pageData.id}`, payload);
        showMsg('success', 'Content updated successfully!');
      } else {
        // Create new
        const res = await apiClient.post('/pages', payload);
        setPageData(res.data.data);
        showMsg('success', 'Content created successfully!');
      }
    } catch (error: any) {
      console.error('Failed to save content', error);
      showMsg('error', error.response?.data?.message || 'Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Manage About Section</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-surface-50 border-r border-surface-200 p-4">
          <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4 px-2">Sections</h3>
          <nav className="space-y-1">
            {ABOUT_SLUGS.map((item) => (
              <button
                key={item.slug}
                onClick={() => setActiveTab(item.slug)}
                className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                  activeTab === item.slug 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-text hover:bg-surface-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-semibold shadow-sm mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-primary">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p className="font-bold text-text-secondary">Loading content...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="mb-6 flex items-center text-lg font-bold text-primary font-heading border-b border-surface-200 pb-4">
                <Edit2 size={20} className="mr-2" />
                Editing: {ABOUT_SLUGS.find(s => s.slug === activeTab)?.label}
                {!pageData && <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-bold">New Page (Not Created Yet)</span>}
              </div>

              <form onSubmit={handleSave} className="space-y-6 flex-1 flex flex-col">
                <AdminFormField label="Section Title" required value={title} onChange={setTitle} />

                <div className="flex-1 min-h-[300px]">
                  <label className="block text-sm font-bold text-text mb-2">Content</label>
                  <div className="bg-white rounded-xl border border-surface-200 overflow-hidden h-[300px]">
                    <ReactQuill
                      theme="snow" value={content} onChange={setContent} className="h-[250px]"
                      modules={{ toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], ['link', 'image', 'video'], ['clean']] }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-200">
                  <ImageUploadField 
                    label="Images (Optional Slider/Gallery)"
                    value={images}
                    onChange={setImages}
                    multiple={true}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-surface-200">
                  <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center shadow-md">
                    <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Content'}
                  </button>
                </div>
              </form>

              {pageData && (
                <div className="mt-8 pt-8 border-t border-surface-200">
                  <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Attached Documents</h4>
                  <DocumentUploadSection section="pages" entityId={pageData.id} label="Section Documents" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutAdminPage;
