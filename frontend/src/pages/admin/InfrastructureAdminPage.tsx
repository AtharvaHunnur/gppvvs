import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Home as HomeIcon, Save, Edit2, Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';
import ImageUploadField from '../../components/admin/ImageUploadField';

const DEFAULT_INFRASTRUCTURE_SLUGS = [
  'library', 'labs', 'function-hall', 'play-ground',
  'indoor-stadium', 'multi-gym', 'womens-hostel',
  'online-classes', 'facilities',
  'green-library', 'language-lab', 'museum', 'ladies-rest-room'
];

const InfrastructureAdminPage = () => {
  const [infraPages, setInfraPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchInfrastructurePages();
  }, []);

  const fetchInfrastructurePages = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/pages');
      if (res.data.success) {
        const allPages = res.data.data;
        // Filter pages that have slugs matching our infrastructure list
        const matched = allPages.filter((p: any) => DEFAULT_INFRASTRUCTURE_SLUGS.includes(p.slug));
        
        // Find missing ones to allow easy creation
        const existingSlugs = matched.map((p: any) => p.slug);
        const missingSlugs = DEFAULT_INFRASTRUCTURE_SLUGS.filter(s => !existingSlugs.includes(s));
        
        const placeholders = missingSlugs.map(s => ({
          id: `new-${s}`,
          slug: s,
          title: s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          isPlaceholder: true
        }));

        setInfraPages([...matched, ...placeholders]);
      }
    } catch (error) {
      console.error('Failed to fetch infrastructure pages', error);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type: string, text: string) => { 
    setMessage({ type, text }); 
    setTimeout(() => setMessage({ type: '', text: '' }), 5000); 
  };

  const handleSelectPage = (page: any) => {
    if (page.isPlaceholder) {
      setSelectedPage({ id: 'new', slug: page.slug });
      setTitle(page.title);
      setSlug(page.slug);
      setContent('');
      setImages([]);
    } else {
      setSelectedPage(page);
      setTitle(page.title);
      setSlug(page.slug);
      setContent(page.content);
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
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this facility page?')) return;
    try {
      await apiClient.delete(`/pages/${id}`);
      showMsg('success', 'Facility page deleted successfully.');
      fetchInfrastructurePages();
    } catch (error) {
      console.error('Failed to delete page', error);
      showMsg('error', 'Failed to delete page.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!formattedSlug) {
      showMsg('error', 'A valid slug is required.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title,
        slug: formattedSlug,
        content,
        images: JSON.stringify(images),
        isPublished: true
      };

      if (selectedPage.id === 'new') {
        await apiClient.post('/pages', payload);
        showMsg('success', 'Facility page created successfully!');
      } else {
        await apiClient.put(`/pages/${selectedPage.id}`, payload);
        showMsg('success', 'Facility page updated successfully!');
      }
      setSelectedPage(null);
      fetchInfrastructurePages();
    } catch (error: any) {
      console.error('Failed to save page', error);
      showMsg('error', error.response?.data?.message || 'Failed to save page.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text flex items-center">
          <HomeIcon className="mr-3 text-primary" size={28} /> Manage Infrastructure Facilities
        </h1>
        {!selectedPage && (
          <button 
            onClick={() => handleSelectPage({ isPlaceholder: true, slug: 'new-facility', title: 'New Facility' })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition shadow-md"
          >
            <Plus size={18} /> Add Custom Facility
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-semibold shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {selectedPage ? (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="p-6 bg-surface-50 border-b border-surface-200 flex items-center justify-between">
            <button onClick={() => setSelectedPage(null)} className="text-primary font-bold hover:text-secondary transition flex items-center text-sm">
              <ArrowLeft size={16} className="mr-2" /> Back to Facilities List
            </button>
            <h3 className="font-bold text-primary font-heading flex items-center text-lg">
              <Edit2 className="mr-2" size={20} /> 
              {selectedPage.id === 'new' ? 'Create New Facility' : `Edit: ${selectedPage.title}`}
            </h3>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField label="Facility Title" required value={title} onChange={setTitle} />
              <AdminFormField 
                label="URL Slug (e.g. library, labs)" 
                required 
                value={slug} 
                onChange={setSlug} 
                disabled={DEFAULT_INFRASTRUCTURE_SLUGS.includes(slug) && selectedPage.id !== 'new'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-2">Facility Details (Content)</label>
              <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
                <ReactQuill
                  theme="snow" value={content} onChange={setContent} className="h-64 mb-12"
                  modules={{ toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], ['link', 'image', 'video'], ['clean']] }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-surface-200">
              <ImageUploadField 
                label="Facility Images (Upload one or more for slider/gallery)"
                value={images}
                onChange={setImages}
                multiple={true}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-200">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center shadow-md">
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Facility'}
              </button>
            </div>
          </form>

          {selectedPage.id !== 'new' && (
            <div className="p-6 pt-0">
              <div className="pt-6 border-t border-surface-200">
                <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Attached Documents (Rules, Forms, etc.)</h4>
                <DocumentUploadSection section="pages" entityId={selectedPage.id} label="Facility Documents" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-primary flex flex-col items-center">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p className="font-bold">Loading infrastructure facilities...</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-200">
              {infraPages.map((page) => (
                <div key={page.id} className={`p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${page.isPlaceholder ? 'bg-yellow-50/30 hover:bg-yellow-50/50' : 'hover:bg-surface-50/50'}`}>
                  <div>
                    <h4 className="font-bold text-text text-lg flex items-center">
                      {page.title}
                      {page.isPlaceholder && <span className="ml-3 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] uppercase rounded-full font-bold">Not Created</span>}
                    </h4>
                    <p className="text-xs text-text-secondary font-mono mt-1">Slug: {page.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSelectPage(page)} 
                      className={`px-4 py-2 border font-semibold rounded-xl transition flex items-center text-sm ${page.isPlaceholder ? 'border-primary text-primary hover:bg-primary hover:text-white' : 'border-primary text-primary hover:bg-primary-50'}`}
                    >
                      {page.isPlaceholder ? <Plus size={14} className="mr-1.5" /> : <Edit2 size={14} className="mr-1.5" />} 
                      {page.isPlaceholder ? 'Create Page' : 'Edit'}
                    </button>
                    {!page.isPlaceholder && !DEFAULT_INFRASTRUCTURE_SLUGS.includes(page.slug) && (
                      <button onClick={() => handleDelete(page.id)} className="px-4 py-2 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition flex items-center text-sm">
                        <Trash2 size={14} className="mr-1.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfrastructureAdminPage;
