import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Trash2, Edit, Eye, EyeOff, GripVertical, Image as ImageIcon, Upload } from 'lucide-react';
import { getImageUrl } from '../../utils/url';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import AdminFormField from '../../components/admin/AdminFormField';

const HeroSlidesAdminPage = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const emptyForm = { title: '', subtitle: '', imageUrl: '', linkUrl: '', position: 0, isVisible: true };
  const [formData, setFormData] = useState(emptyForm);

  const fetchSlides = async () => {
    try {
      const res = await apiClient.get('/hero-slides?all=true');
      setSlides(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, position: slides.length });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: any) => {
    setEditingId(slide.id);
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      imageUrl: slide.imageUrl || '',
      linkUrl: slide.linkUrl || '',
      position: slide.position ?? 0,
      isVisible: slide.isVisible ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/hero-slides/${editingId}`, formData);
      } else {
        await apiClient.post('/hero-slides', formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchSlides();
    } catch (error) {
      alert('Failed to save slide');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      await apiClient.delete(`/hero-slides/${id}`);
      fetchSlides();
    } catch (error) {
      alert('Failed to delete slide');
    }
  };

  const toggleVisibility = async (slide: any) => {
    try {
      await apiClient.put(`/hero-slides/${slide.id}`, { isVisible: !slide.isVisible });
      fetchSlides();
    } catch (error) {
      alert('Failed to update visibility');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiClient.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, imageUrl: res.data.data.url });
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading hero slides...</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hero Slider"
        description="Manage the images that appear in the homepage hero slider."
        actionLabel="Add Slide"
        actionIcon={Plus}
        onAction={openAddModal}
      />

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-lg ${
              slide.isVisible ? 'border-surface-200' : 'border-red-200 opacity-70'
            }`}
          >
            {/* Image Preview */}
            <div className="relative aspect-video bg-surface-100">
              {slide.imageUrl ? (
                <img
                  src={getImageUrl(slide.imageUrl)}
                  alt={slide.title || 'Slide'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary">
                  <ImageIcon size={48} className="opacity-30" />
                </div>
              )}
              {/* Position Badge */}
              <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                #{slide.position + 1}
              </div>
              {!slide.isVisible && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                  Hidden
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="font-bold text-text text-base mb-1 line-clamp-1">
                {slide.title || <span className="text-text-secondary italic">No title</span>}
              </h3>
              {slide.subtitle && (
                <p className="text-sm text-text-secondary line-clamp-1 mb-3">{slide.subtitle}</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => toggleVisibility(slide)}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.isVisible
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-500 hover:bg-red-50'
                    }`}
                    title={slide.isVisible ? 'Hide' : 'Show'}
                  >
                    {slide.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="col-span-full py-16 text-center text-text-secondary border-2 border-dashed rounded-2xl">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No slides added yet.</p>
            <p className="text-sm mt-1">Click "Add Slide" to create your first hero slide.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Slide' : 'Add New Slide'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-text mb-2">Slide Image *</label>
            {formData.imageUrl && (
              <div className="mb-3 rounded-xl overflow-hidden border border-surface-200 aspect-video">
                <img
                  src={getImageUrl(formData.imageUrl)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-surface-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary-50 transition-colors">
                <Upload size={18} />
                <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <AdminFormField
              label="Or paste Image URL"
              value={formData.imageUrl}
              onChange={(v) => setFormData({ ...formData, imageUrl: v })}
              placeholder="https://..."
              hint="Upload an image above or paste a direct URL"
              className="mt-3"
            />
          </div>

          <AdminFormField
            label="Title (Optional)"
            value={formData.title}
            onChange={(v) => setFormData({ ...formData, title: v })}
            placeholder="Moulding the Rural Youth..."
            hint="Displayed as the main heading on the slide"
          />

          <AdminFormField
            label="Subtitle (Optional)"
            value={formData.subtitle}
            onChange={(v) => setFormData({ ...formData, subtitle: v })}
            placeholder="Est. 1972 • 50+ Years of Excellence"
            hint="Displayed as a badge above the title"
          />

          <AdminFormField
            label="Link URL (Optional)"
            value={formData.linkUrl}
            onChange={(v) => setFormData({ ...formData, linkUrl: v })}
            placeholder="/departments"
            hint="Where the CTA button links to"
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminFormField
              label="Position"
              type="number"
              value={formData.position}
              onChange={(v) => setFormData({ ...formData, position: v })}
              hint="Lower numbers show first"
            />
            <AdminFormField
              label="Visible on site"
              type="checkbox"
              value={formData.isVisible}
              onChange={(v) => setFormData({ ...formData, isVisible: v })}
              className="flex items-end pb-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-surface-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 transition-colors"
            >
              {editingId ? 'Update Slide' : 'Create Slide'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default HeroSlidesAdminPage;
