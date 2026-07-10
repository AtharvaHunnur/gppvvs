import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, MessageSquareQuote } from 'lucide-react';

const TestimonialsAdminPage = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyForm = {
    name: '',
    role: '',
    batch: '',
    content: '',
    photo: '',
    isPublished: true,
    position: 0,
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchTestimonials = async () => {
    try {
      const res = await apiClient.get('/testimonials');
      setTestimonials(res.data.data);
    } catch (error) {
      console.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: any) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name || '',
      role: testimonial.role || '',
      batch: testimonial.batch || '',
      content: testimonial.content || '',
      photo: testimonial.photo || '',
      isPublished: testimonial.isPublished,
      position: testimonial.position || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/testimonials/${editingId}`, { ...formData, position: Number(formData.position) });
      } else {
        await apiClient.post('/testimonials', { ...formData, position: Number(formData.position) });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchTestimonials();
    } catch (error) {
      alert('Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await apiClient.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (error) {
      alert('Failed to delete testimonial');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/testimonials/${id}`, { isPublished: !currentStatus });
      fetchTestimonials();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Manage Testimonials</h1>
          <p className="text-text-secondary text-sm">Add and manage student and alumni reviews.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className={`bg-white rounded-2xl shadow-sm border ${testimonial.isPublished ? 'border-surface-200' : 'border-dashed border-surface-300 opacity-75'} p-6 relative flex flex-col`}>
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <button 
                onClick={() => togglePublish(testimonial.id, testimonial.isPublished)}
                className={`text-xs px-2 py-1 rounded font-bold ${testimonial.isPublished ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-text-secondary'}`}
              >
                {testimonial.isPublished ? 'Published' : 'Hidden'}
              </button>
              <button onClick={() => openEditModal(testimonial)} className="text-surface-300 hover:text-primary transition"><Edit size={16} /></button>
              <button onClick={() => handleDelete(testimonial.id)} className="text-surface-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
            </div>

            <MessageSquareQuote size={32} className="text-primary-100 mb-4" />
            
            <p className="text-sm text-text-secondary italic mb-6 flex-grow line-clamp-4">
              "{testimonial.content}"
            </p>

            <div className="flex items-center mt-auto border-t border-surface-100 pt-4">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary font-bold mr-3 overflow-hidden">
                {testimonial.photo ? <img src={testimonial.photo} alt={testimonial.name} className="w-full h-full object-cover" /> : testimonial.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-text text-sm">{testimonial.name}</div>
                <div className="text-xs text-text-secondary">{testimonial.role} {testimonial.batch && `(${testimonial.batch})`}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Student Name" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Role *</label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Alumnus / Student" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Batch</label>
                  <input value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="2018-2021" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Content *</label>
                  <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-4 py-2 border rounded-lg resize-none" placeholder="Their testimonial..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Photo URL</label>
                  <input value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                </div>
                <div className="col-span-2 flex items-center">
                  <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="mr-2" />
                  <label htmlFor="isPublished" className="text-sm font-bold">Publish immediately</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsAdminPage;
