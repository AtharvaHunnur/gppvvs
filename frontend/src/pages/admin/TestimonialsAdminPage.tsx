import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, MessageSquareQuote } from 'lucide-react';
import { getImageUrl } from '../../utils/url';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const TestimonialsAdminPage = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string | null>(null);

  const emptyForm = { name: '', role: '', batch: '', content: '', photo: '', isPublished: true, position: 0 };
  const [formData, setFormData] = useState(emptyForm);

  const fetchTestimonials = async () => {
    try { const res = await apiClient.get('/testimonials'); setTestimonials(res.data.data); }
    catch (error) { console.error('Failed to fetch testimonials'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openAddModal = () => { setEditingId(null); setFormData(emptyForm); setIsModalOpen(true); };

  const openEditModal = (testimonial: any) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name || '', role: testimonial.role || '', batch: testimonial.batch || '',
      content: testimonial.content || '', photo: testimonial.photo || '',
      isPublished: testimonial.isPublished, position: testimonial.position || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) { await apiClient.put(`/testimonials/${editingId}`, { ...formData, position: Number(formData.position) }); }
      else { await apiClient.post('/testimonials', { ...formData, position: Number(formData.position) }); }
      setIsModalOpen(false); setEditingId(null); setFormData(emptyForm); fetchTestimonials();
    } catch (error) { alert('Failed to save testimonial'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await apiClient.delete(`/testimonials/${id}`); if (selectedTestimonialId === id) setSelectedTestimonialId(null); fetchTestimonials(); }
    catch (error) { alert('Failed to delete testimonial'); }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try { await apiClient.put(`/testimonials/${id}`, { isPublished: !currentStatus }); fetchTestimonials(); }
    catch (error) { alert('Failed to update status'); }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading testimonials...</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Manage Testimonials" description="Add and manage student and alumni reviews." actionLabel="Add Testimonial" actionIcon={Plus} onAction={openAddModal} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className={`bg-white rounded-2xl shadow-sm border ${testimonial.isPublished ? 'border-surface-200' : 'border-dashed border-surface-300 opacity-75'} p-6 relative flex flex-col`}>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button onClick={() => togglePublish(testimonial.id, testimonial.isPublished)} className={`text-xs px-2 py-1 rounded font-bold ${testimonial.isPublished ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-text-secondary'}`}>
                {testimonial.isPublished ? 'Published' : 'Hidden'}
              </button>
              <button onClick={() => openEditModal(testimonial)} className="text-surface-300 hover:text-primary transition"><Edit size={16} /></button>
              <button onClick={() => handleDelete(testimonial.id)} className="text-surface-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
            </div>

            <MessageSquareQuote size={32} className="text-primary-100 mb-4" />
            <p className="text-sm text-text-secondary italic mb-6 flex-grow line-clamp-4">"{testimonial.content}"</p>

            <div className="flex items-center mt-auto border-t border-surface-100 pt-4">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary font-bold mr-3 overflow-hidden">
                {testimonial.photo ? <img src={getImageUrl(testimonial.photo)} alt={testimonial.name} className="w-full h-full object-cover" /> : testimonial.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-text text-sm">{testimonial.name}</div>
                <div className="text-xs text-text-secondary">{testimonial.role} {testimonial.batch && `(${testimonial.batch})`}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <AdminFormField label="Name" required value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="Student Name" className="col-span-2" />
            <AdminFormField label="Role" required value={formData.role} onChange={(v) => setFormData({ ...formData, role: v })} placeholder="Alumnus / Student" />
            <AdminFormField label="Batch" value={formData.batch} onChange={(v) => setFormData({ ...formData, batch: v })} placeholder="2018-2021" />
            <AdminFormField label="Content" required type="textarea" rows={4} value={formData.content} onChange={(v) => setFormData({ ...formData, content: v })} placeholder="Their testimonial..." className="col-span-2" />
            <AdminFormField label="Photo URL" value={formData.photo} onChange={(v) => setFormData({ ...formData, photo: v })} placeholder="https://..." className="col-span-2" />
            <AdminFormField label="Publish immediately" type="checkbox" value={formData.isPublished} onChange={(v) => setFormData({ ...formData, isPublished: v })} className="col-span-2" />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update' : 'Save'}</button>
          </div>
        </form>

        <div className="pt-6 mt-6 border-t border-surface-200">
          <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Documents</h4>
          <DocumentUploadSection section="testimonials" entityId={editingId} label="Testimonial Documents" />
        </div>
      </AdminModal>
    </div>
  );
};

export default TestimonialsAdminPage;
