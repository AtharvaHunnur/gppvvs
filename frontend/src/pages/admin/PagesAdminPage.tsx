import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { FileText, Save, Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getImageUrl } from '../../utils/url';
const PagesAdminPage = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await apiClient.get('/pages');
      setPages(res.data.data);
    } catch (error) {
      console.error('Failed to fetch pages', error);
      showMsg('error', 'Failed to load pages.');
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSelectPage = (page: any) => {
    setSelectedPage(page);
    setTitle(page.title);
    setContent(page.content);
    
    // Parse images array
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
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    setSaving(true);
    try {
      await apiClient.put(`/pages/${selectedPage.id}`, {
        title,
        content,
        images: JSON.stringify(images)
      });
      showMsg('success', 'Page updated successfully!');
      fetchPages(); // reload list
    } catch (error) {
      console.error('Failed to update page', error);
      showMsg('error', 'Failed to update page.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-text-secondary">Loading pages editor...</div>;
  }

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-semibold shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {selectedPage ? (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="p-6 bg-surface-50 border-b border-surface-200 flex items-center justify-between">
            <button 
              onClick={() => setSelectedPage(null)}
              className="text-primary font-bold hover:text-secondary transition flex items-center text-sm"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Pages List
            </button>
            <h3 className="font-bold text-primary font-heading flex items-center text-lg">
              <Edit2 className="mr-2" size={20} /> Edit: {selectedPage.title}
            </h3>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Page Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:border-primary-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">Page Content</label>
              <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
                <ReactQuill 
                  theme="snow"
                  value={content} 
                  onChange={setContent}
                  className="h-64 mb-12"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ]
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">Page Images Slider</label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Enter image URL (e.g. /images/about_building.png or https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:border-primary-400 text-sm"
                  />
                  <button 
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-3 bg-secondary text-primary-900 font-bold rounded-xl hover:bg-secondary-50 transition flex items-center text-sm"
                  >
                    <Plus size={18} className="mr-1" /> Add Image
                  </button>
                </div>

                {images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border border-surface-200 p-4 rounded-2xl bg-surface-50">
                    {images.map((imgUrl, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm aspect-video bg-white border border-surface-200">
                        <img src={getImageUrl(imgUrl)} alt={`Page img ${index}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white truncate">
                          {imgUrl}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary italic">No images added for the slider yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-200">
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center"
              >
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Page Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="p-6 bg-surface-50 border-b border-surface-200">
            <h3 className="font-bold text-primary font-heading flex items-center text-lg">
              <FileText className="mr-2" size={20} /> Manage Institutional Pages
            </h3>
          </div>
          
          <div className="divide-y divide-surface-200">
            {pages.map((page) => (
              <div key={page.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-surface-50/50 transition-colors">
                <div>
                  <h4 className="font-bold text-text text-lg">{page.title}</h4>
                  <p className="text-xs text-text-secondary font-mono mt-1">Slug: {page.slug}</p>
                </div>
                <button 
                  onClick={() => handleSelectPage(page)}
                  className="px-4 py-2 border border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition flex items-center text-sm"
                >
                  <Edit2 size={14} className="mr-1.5" /> Edit Page & Images
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesAdminPage;
