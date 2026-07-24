import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Pin } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import AdminTable from '../../components/admin/AdminTable';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const NoticesAdminPage = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  const emptyForm = { title: '', content: '', category: 'GENERAL', isPinned: false };
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

  useEffect(() => { fetchNotices(); }, []);

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
      isPinned: notice.isPinned || false,
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
      if (selectedNoticeId === id) setSelectedNoticeId(null);
      fetchNotices();
    } catch (error) {
      console.error('Failed to delete notice', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading notices...</div>;

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (row: any) => (
        <div>
          <div className="font-bold text-text mb-1">{row.title}</div>
          <div className="text-xs text-text-secondary line-clamp-1">{row.content || 'No content'}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row: any) => (
        <span className="px-2.5 py-1 bg-surface-200 text-text text-xs font-bold rounded-full">
          {row.category}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row: any) => (
        <span className="text-sm text-text-secondary">
          {format(new Date(row.createdAt), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) =>
        row.isPinned ? (
          <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full w-max">
            <Pin size={12} className="mr-1" /> Pinned
          </span>
        ) : (
          <span className="text-xs text-text-secondary">Standard</span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (row: any) => (
          <button onClick={() => openEditModal(row)} className="text-text-secondary hover:text-primary p-2 transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-red-500 p-2 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manage Notices"
        description="Create, edit, and organize institutional announcements."
        actionLabel="Add Notice"
        actionIcon={Plus}
        onAction={openAddModal}
      />

      <AdminTable columns={columns} data={notices} emptyMessage="No notices found. Click 'Add Notice' to create one." />

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Notice' : 'Create New Notice'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminFormField label="Title" required value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="Enter notice title" />
          <AdminFormField label="Content" required type="textarea" rows={3} value={formData.content} onChange={(v) => setFormData({ ...formData, content: v })} placeholder="Notice content..." />
          <div className="grid grid-cols-2 gap-4">
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
          <div className="pt-4 border-t border-surface-200 flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-text-secondary hover:bg-surface-100 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-secondary text-primary-900 font-bold rounded-lg hover:bg-yellow-500 transition shadow-sm">
              {editingId ? 'Update Notice' : 'Publish Notice'}
            </button>
          </div>
        </form>

        <div className="pt-6 mt-6 border-t border-surface-200">
          <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Documents</h4>
          <DocumentUploadSection section="notices" entityId={editingId} label="Notice Documents" />
        </div>
      </AdminModal>
    </div>
  );
};

export default NoticesAdminPage;
