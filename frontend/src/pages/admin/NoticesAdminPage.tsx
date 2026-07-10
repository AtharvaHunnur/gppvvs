import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Pin, Search, AlertCircle } from 'lucide-react';

const NoticesAdminPage = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyForm = {
    title: '',
    content: '',
    category: 'GENERAL',
    isPinned: false
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchNotices = async () => {
    try {
      const res = await apiClient.get('/notices?limit=100');
      setNotices(res.data.data);
    } catch (error) {
      console.error('Failed to fetch notices', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (notice: any) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title || '',
      content: notice.content || '',
      category: notice.category || 'GENERAL',
      isPinned: notice.isPinned || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/notices/${editingId}`, formData);
      } else {
        await apiClient.post('/notices', formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchNotices();
    } catch (error) {
      console.error('Failed to save notice', error);
      alert('Failed to save notice. See console.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await apiClient.delete(`/notices/${id}`);
      fetchNotices();
    } catch (error) {
      console.error('Failed to delete notice', error);
    }
  };

  if (loading) return <div>Loading notices...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Manage Notices</h1>
          <p className="text-text-secondary text-sm">Create, edit, and organize institutional announcements.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" /> Add Notice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="p-4 border-b border-surface-200 bg-surface-50 flex justify-between items-center">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-text-secondary" size={16} />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50 text-text-secondary text-xs uppercase tracking-wider border-b border-surface-200">
              <th className="p-4 font-bold">Title</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {notices.map(notice => (
              <tr key={notice.id} className="hover:bg-surface-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-text mb-1">{notice.title}</div>
                  <div className="text-xs text-text-secondary line-clamp-1">{notice.content || 'No content'}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-surface-200 text-text text-xs font-bold rounded-full">
                    {notice.category}
                  </span>
                </td>
                <td className="p-4 text-sm text-text-secondary">
                  {format(new Date(notice.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="p-4">
                  {notice.isPinned ? (
                    <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full w-max">
                      <Pin size={12} className="mr-1" /> Pinned
                    </span>
                  ) : (
                    <span className="text-xs text-text-secondary">Standard</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openEditModal(notice)} className="text-text-secondary hover:text-primary p-2 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(notice.id)}
                    className="text-text-secondary hover:text-red-500 p-2 transition-colors ml-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-text-secondary">
                  <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                  No notices found. Click 'Add Notice' to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit Notice' : 'Create New Notice'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-text">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-text mb-1">Title *</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary transition"
                  placeholder="Enter notice title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-text mb-1">Content *</label>
                <textarea 
                  rows={3}
                  required
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary transition resize-none"
                  placeholder="Notice content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary transition bg-white"
                  >
                    <option value="GENERAL">General</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAM">Examination</option>
                    <option value="ADMISSION">Admission</option>
                    <option value="PLACEMENT">Placement</option>
                  </select>
                </div>
                
                <div className="flex items-center mt-6">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={e => setFormData({...formData, isPinned: e.target.checked})}
                      className="w-5 h-5 rounded border-surface-300 text-primary focus:ring-primary mr-3"
                    />
                    <span className="text-sm font-bold text-text flex items-center">
                      <Pin size={16} className="mr-1 text-orange-500" /> Pin to top
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-200 flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-text-secondary hover:bg-surface-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-secondary text-primary-900 font-bold rounded-lg hover:bg-yellow-500 transition shadow-sm"
                >
                  {editingId ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesAdminPage;
