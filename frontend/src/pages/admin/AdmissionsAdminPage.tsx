import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Save, Edit2, Loader2, BookOpen } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';
import ImageUploadField from '../../components/admin/ImageUploadField';

const AdmissionsAdminPage = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('Admissions');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiClient.get('/pages/admissions');
      if (res.data.success && res.data.data) {
        const page = res.data.data;
        setPageData(page);
        setTitle(page.title || 'Admissions');
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
        setPageData(null);
      }
    } catch (error) {
      console.error('Failed to fetch admissions page', error);
      setPageData(null);
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
        slug: 'admissions',
        content,
        images: JSON.stringify(images),
        isPublished: true
      };

      if (pageData && pageData.id) {
        await apiClient.put(`/pages/${pageData.id}`, payload);
        showMsg('success', 'Admissions content updated successfully!');
      } else {
        const res = await apiClient.post('/pages', payload);
        setPageData(res.data.data);
        showMsg('success', 'Admissions content created successfully!');
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
        <h1 className="text-2xl font-bold text-text flex items-center">
          <BookOpen className="mr-3 text-primary" size={28} /> Manage Admissions
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden min-h-[600px] flex flex-col">
        {message.text && (
          <div className={`p-4 rounded-none text-sm font-semibold border-b ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-primary py-20">
            <Loader2 size={32} className="animate-spin mb-4" />
            <p className="font-bold text-text-secondary">Loading content...</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-6">
            <div className="mb-6 flex items-center text-lg font-bold text-primary font-heading border-b border-surface-200 pb-4">
              <Edit2 size={20} className="mr-2" />
              Editing: Admissions Page
              {!pageData && <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-bold">New Page (Not Created Yet)</span>}
            </div>

            <form onSubmit={handleSave} className="space-y-6 flex-1 flex flex-col">
              <AdminFormField label="Page Title" required value={title} onChange={setTitle} />

              <div className="flex-1 min-h-[300px]">
                <label className="block text-sm font-bold text-text mb-2">Content (Eligibility, Fees, Important Dates)</label>
                <div className="bg-white rounded-xl border border-surface-200 overflow-hidden h-[300px]">
                  <ReactQuill
                    theme="snow" value={content} onChange={setContent} className="h-[250px]"
                    modules={{ toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], ['link', 'image', 'video'], ['clean']] }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-surface-200">
                <ImageUploadField 
                  label="Header / Slider Images"
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
                <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Attached Documents (Prospectus, Admission Forms)</h4>
                <DocumentUploadSection section="pages" entityId={pageData.id} label="Admissions Documents" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionsAdminPage;
