import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, FileDown } from 'lucide-react';

const DownloadsAdminPage = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyForm = { title: '', fileUrl: '', category: 'OTHER' };
  const [formData, setFormData] = useState(emptyForm);

  const fetchDownloads = async () => {
    try {
      const res = await apiClient.get('/downloads');
      setDownloads(res.data.data);
    } catch (error) {
      console.error('Failed to fetch downloads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (doc: any) => {
    setEditingId(doc.id);
    setFormData({ title: doc.title || '', fileUrl: doc.fileUrl || '', category: doc.category || 'OTHER' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/downloads/${editingId}`, formData);
      } else {
        await apiClient.post('/downloads', formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchDownloads();
    } catch (error) {
      alert('Failed to save download');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await apiClient.delete(`/downloads/${id}`);
      fetchDownloads();
    } catch (error) {
      alert('Failed to delete download');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Manage Downloads</h1>
          <p className="text-text-secondary text-sm">Upload forms, syllabi, and resources for students.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" /> Add Document
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50 text-text-secondary text-xs uppercase tracking-wider border-b border-surface-200">
              <th className="p-4 font-bold">Document Title</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">URL</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {downloads.map(doc => (
              <tr key={doc.id} className="hover:bg-surface-50 transition-colors">
                <td className="p-4 font-bold text-text flex items-center">
                  <FileDown size={18} className="mr-2 text-primary" /> {doc.title}
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-surface-200 text-text text-xs font-bold rounded-full">{doc.category}</span>
                </td>
                <td className="p-4 text-xs text-primary underline truncate max-w-[200px]">
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer">{doc.fileUrl}</a>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openEditModal(doc)} className="text-text-secondary hover:text-primary p-2"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(doc.id)} className="text-text-secondary hover:text-red-500 p-2 ml-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {downloads.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-text-secondary">No documents added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit Document' : 'Add Document Link'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Title *</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="B.Com Syllabus 2026" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">File URL *</label>
                <input required value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                <p className="text-xs text-text-secondary mt-1">Upload the file to your drive/S3 and paste the direct link here.</p>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Category *</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                  <option value="OTHER">Other</option>
                  <option value="SYLLABUS">Syllabus</option>
                  <option value="CIRCULAR">Circular</option>
                  <option value="REPORT">Report</option>
                  <option value="FORM">Form</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update' : 'Add Link'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadsAdminPage;
