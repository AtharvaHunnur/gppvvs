import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { FileText, Save, Plus, Trash2, Edit2, ArrowLeft, RefreshCw } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';
import ImageUploadField from '../../components/admin/ImageUploadField';

const PagesAdminPage = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    try { 
      setLoading(true);
      const res = await apiClient.get('/pages'); 
      setPages(res.data.data || []); 
    }
    catch (error) { console.error('Failed to fetch pages', error); showMsg('error', 'Failed to load pages.'); }
    finally { setLoading(false); }
  };

  const showMsg = (type: string, text: string) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: '', text: '' }), 5000); };

  const handleSelectPage = (page: any) => {
    setSelectedPage(page); 
    setTitle(page.title || ''); 
    setSlug(page.slug || '');
    setContent(page.content || '');
    if (page.images) {
      try { 
        const parsed = typeof page.images === 'string' ? JSON.parse(page.images) : page.images; 
        setImages(Array.isArray(parsed) ? parsed : []); 
      }
      catch (e) { setImages([]); }
    } else { setImages([]); }
  };

  const handleCreateNew = () => {
    setSelectedPage({ id: 'new' });
    setTitle('');
    setSlug('');
    setContent('');
    setImages([]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await apiClient.delete(`/pages/${id}`);
      showMsg('success', 'Page deleted successfully.');
      fetchPages();
    } catch (error) {
      console.error('Failed to delete page', error);
      showMsg('error', 'Failed to delete page.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    
    // basic slug validation
    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!formattedSlug) {
      showMsg('error', 'A valid slug is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = { 
        title, 
        slug: formattedSlug,
        content, 
        images: JSON.stringify(images) 
      };

      if (selectedPage.id === 'new') {
        await apiClient.post('/pages', payload);
        showMsg('success', 'Page created successfully!');
      } else {
        await apiClient.put(`/pages/${selectedPage.id}`, payload);
        showMsg('success', 'Page updated successfully!');
      }
      setSelectedPage(null);
      fetchPages();
    } catch (error: any) { 
      console.error('Failed to save page', error); 
      showMsg('error', error.response?.data?.message || 'Failed to save page.'); 
    }
    finally { setSaving(false); }
  };

  if (loading && pages.length === 0) return <div className="p-8 text-center text-text-secondary">Loading pages editor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Manage Pages</h1>
        {!selectedPage && (
          <div className="flex gap-2">
            <button 
              onClick={fetchPages}
              className="flex items-center gap-2 px-4 py-2 bg-surface-200 text-text rounded-lg hover:bg-surface-300 transition"
            >
              <RefreshCw size={18} /> Refresh
            </button>
            <button 
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition shadow-md"
            >
              <Plus size={18} /> Create Page
            </button>
          </div>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-semibold shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {selectedPage ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="p-6 bg-surface-50 border-b border-surface-200 flex items-center justify-between">
              <button onClick={() => setSelectedPage(null)} className="text-primary font-bold hover:text-secondary transition flex items-center text-sm">
                <ArrowLeft size={16} className="mr-2" /> Back to Pages List
              </button>
              <h3 className="font-bold text-primary font-heading flex items-center text-lg">
                <Edit2 className="mr-2" size={20} /> 
                {selectedPage.id === 'new' ? 'Create New Page' : `Edit: ${selectedPage.title}`}
              </h3>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminFormField label="Page Title" required value={title} onChange={setTitle} />
                <AdminFormField 
                  label="URL Slug (e.g. about-us)" 
                  required 
                  value={slug} 
                  onChange={setSlug} 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-2">Page Content</label>
                <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
                  <ReactQuill
                    theme="snow" value={content} onChange={setContent} className="h-64 mb-12"
                    modules={{ toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], ['link', 'image', 'video'], ['clean']] }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-surface-200">
                <ImageUploadField 
                  label="Page Images Slider (Upload one or more)"
                  value={images}
                  onChange={setImages}
                  multiple={true}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-surface-200">
                <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center shadow-md">
                  <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Page'}
                </button>
              </div>
            </form>

            {selectedPage.id !== 'new' && (
              <div className="p-6 pt-0">
                <div className="pt-6 border-t border-surface-200">
                  <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Documents</h4>
                  <DocumentUploadSection section="pages" entityId={selectedPage.id} label="Page Documents" />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="divide-y divide-surface-200">
            {pages.map((page) => (
              <div key={page.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-surface-50/50 transition-colors">
                <div>
                  <h4 className="font-bold text-text text-lg">{page.title}</h4>
                  <p className="text-xs text-text-secondary font-mono mt-1">Slug: {page.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSelectPage(page)} className="px-4 py-2 border border-primary text-primary font-semibold rounded-xl hover:bg-primary-50 transition flex items-center text-sm">
                    <Edit2 size={14} className="mr-1.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(page.id)} className="px-4 py-2 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition flex items-center text-sm">
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
            {pages.length === 0 && !loading && (
              <div className="p-8 text-center text-text-secondary">
                No pages found. Create one.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PagesAdminPage;
