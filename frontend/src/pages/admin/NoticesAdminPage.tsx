import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { format } from 'date-fns';
import { Plus, Trash2, Pin, Save, Edit2, Bell } from 'lucide-react';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const NoticesAdminPage = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const emptyForm = { title: '', content: '', category: 'GENERAL', isPinned: false };
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      const res = await apiClient.get('/notices?limit=100');
      setNotices(res.data.data);
      if (!editingId && res.data.data.length > 0) {
        handleSelect(res.data.data[0]);
      } else if (!editingId) {
        handleAddNew();
      }
    } catch (error) {
      console.error('Failed to fetch notices', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const showMsg = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSelect = (notice: any) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title || '',
      content: notice.content || '',
      category: notice.category || 'GENERAL',
      isPinned: notice.isPinned || false,
    });
    setMessage({ type: '', text: '' });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/notices/${editingId}`, formData);
        showMsg('success', 'Notice updated successfully!');
      } else {
        const res = await apiClient.post('/notices', formData);
        setEditingId(res.data.data.id);
        showMsg('success', 'Notice published successfully!');
      }
      fetchNotices();
    } catch (error: any) {
      showMsg('error', error.response?.data?.message || 'Failed to save notice.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await apiClient.delete(`/notices/${id}`);
      if (editingId === id) {
        handleAddNew();
      }
      fetchNotices();
      showMsg('success', 'Notice deleted.');
    } catch (error) {
      showMsg('error', 'Failed to delete notice.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text flex items-center">
          <Bell className="mr-3 text-primary" size={28} /> Manage Notices
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-surface-50 border-r border-surface-200 p-4 flex flex-col max-h-[800px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Notices</h3>
            <button onClick={handleAddNew} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md transition-colors" title="Add New">
              <Plus size={18} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {loading ? (
              <div className="text-center py-4 text-text-secondary text-sm">Loading...</div>
            ) : notices.length === 0 ? (
              <div className="text-center py-4 text-text-secondary text-sm">No notices found.</div>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleSelect(notice)}
                  className={`w-full flex items-center justify-between px-3 py-3 text-sm font-bold rounded-xl transition-colors cursor-pointer group ${
                    editingId === notice.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-text hover:bg-surface-200 border border-surface-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="flex items-center gap-1">
                      {notice.isPinned && <Pin size={12} className={editingId === notice.id ? 'text-yellow-200' : 'text-orange-500'} />}
                      {notice.title}
                    </div>
                    <div className={`text-xs font-normal truncate ${editingId === notice.id ? 'text-primary-100' : 'text-text-secondary'}`}>
                      {format(new Date(notice.createdAt), 'MMM dd, yyyy')} · {notice.category}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(notice.id, e)}
                    className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                      editingId === notice.id ? 'text-white hover:bg-white/20' : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col max-h-[800px] overflow-y-auto">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-semibold shadow-sm mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="mb-6 flex items-center text-lg font-bold text-primary font-heading border-b border-surface-200 pb-4">
            <Edit2 size={20} className="mr-2" />
            {editingId ? `Editing: ${formData.title}` : 'Create New Notice'}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <AdminFormField label="Title" required value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="Enter notice title" />
            <AdminFormField label="Content" required type="textarea" rows={6} value={formData.content} onChange={(v) => setFormData({ ...formData, content: v })} placeholder="Notice content..." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField
                label="Category"
                type="select"
                value={formData.category}
                onChange={(v) => setFormData({ ...formData, category: v })}
                options={[
                  { value: 'GENERAL', label: 'General' },
                  { value: 'ACADEMIC', label: 'Academic' },
                  { value: 'EXAM', label: 'Examination' },
                  { value: 'ADMISSION', label: 'Admission' },
                  { value: 'PLACEMENT', label: 'Placement' },
                ]}
              />
              <AdminFormField label="Pin to top" type="checkbox" value={formData.isPinned} onChange={(v) => setFormData({ ...formData, isPinned: v })} className="mt-6" />
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-200">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center shadow-md">
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : (editingId ? 'Update Notice' : 'Publish Notice')}
              </button>
            </div>
          </form>

          {editingId && (
            <div className="mt-8 pt-8 border-t border-surface-200">
              <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Attached Documents</h4>
              <DocumentUploadSection section="notices" entityId={editingId} label="Notice Documents" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticesAdminPage;
