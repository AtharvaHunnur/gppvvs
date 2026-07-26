import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, FileDown } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import AdminTable from '../../components/admin/AdminTable';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const DownloadsAdminPage = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDownloadId, setSelectedDownloadId] = useState<string | null>(null);

  const emptyForm = { title: '', fileUrl: '', category: 'OTHER' };
  const [formData, setFormData] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchDownloads = async () => {
    try { const res = await apiClient.get('/downloads'); setDownloads(res.data.data); }
    catch (error) { console.error('Failed to fetch downloads'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDownloads(); }, []);

  const openAddModal = () => { setEditingId(null); setFormData(emptyForm); setFile(null); setIsModalOpen(true); };
  const openEditModal = (doc: any) => { setEditingId(doc.id); setFormData({ title: doc.title || '', fileUrl: doc.fileUrl || '', category: doc.category || 'OTHER' }); setFile(null); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalFileUrl = formData.fileUrl;
      
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await apiClient.post('/upload/single', uploadData, {
          headers: { 'Content-Type': undefined },
        });
        finalFileUrl = uploadRes.data.data.url;
      }
      
      const payload = { ...formData, fileUrl: finalFileUrl };

      if (editingId) { await apiClient.put(`/downloads/${editingId}`, payload); }
      else { await apiClient.post('/downloads', payload); }
      
      setIsModalOpen(false); setEditingId(null); setFormData(emptyForm); setFile(null); fetchDownloads();
    } catch (error) { alert('Failed to save download'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this document?')) return;
    try { await apiClient.delete(`/downloads/${id}`); if (selectedDownloadId === id) setSelectedDownloadId(null); fetchDownloads(); }
    catch (error) { alert('Failed to delete download'); }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading downloads...</div>;

  const columns = [
    {
      key: 'title', label: 'Document Title',
      render: (row: any) => (
        <div className="font-bold text-text flex items-center"><FileDown size={18} className="mr-2 text-primary" /> {row.title}</div>
      ),
    },
    {
      key: 'category', label: 'Category',
      render: (row: any) => <span className="px-2.5 py-1 bg-surface-200 text-text text-xs font-bold rounded-full">{row.category}</span>,
    },
    {
      key: 'fileUrl', label: 'URL',
      render: (row: any) => (
        <span className="text-xs text-primary underline truncate max-w-[200px] block">
          <a href={row.fileUrl} target="_blank" rel="noreferrer">{row.fileUrl}</a>
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions', align: 'right' as const,
      render: (row: any) => (
        <div className="flex justify-end">
          <button onClick={() => openEditModal(row)} className="text-text-secondary hover:text-primary p-2"><Edit size={18} /></button>
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-red-500 p-2 ml-2"><Trash2 size={18} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Manage Downloads" description="Upload forms, syllabi, and resources for students." actionLabel="Add Document" actionIcon={Plus} onAction={openAddModal} />
      <AdminTable columns={columns} data={downloads} emptyMessage="No documents added yet." />

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Document' : 'Add Document Link'} maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminFormField label="Title" required value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="B.Com Syllabus 2026" />
          
          <div>
            <label className="block text-sm font-bold text-text mb-1">Upload File (Optional)</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 cursor-pointer"
            />
            <p className="text-xs text-text-secondary mt-1">Select a file from your computer, or paste an external URL below.</p>
          </div>

          <AdminFormField label="External URL" required={!file && !formData.fileUrl} value={formData.fileUrl} onChange={(v) => setFormData({ ...formData, fileUrl: v })} placeholder="https://..." hint="Leave empty if you uploaded a file above." />
          
          <AdminFormField label="Category" required type="select" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} options={[{ value: 'OTHER', label: 'Other' }, { value: 'SYLLABUS', label: 'Syllabus' }, { value: 'CIRCULAR', label: 'Circular' }, { value: 'REPORT', label: 'Report' }, { value: 'FORM', label: 'Form' }, { value: 'LIBRARY', label: 'Library' }]} />
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={uploading} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {uploading ? 'Saving...' : (editingId ? 'Update' : 'Add Document')}
            </button>
          </div>
        </form>

        <div className="pt-6 mt-6 border-t border-surface-200">
          <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Documents</h4>
          <DocumentUploadSection section="downloads" entityId={editingId} label="Related Documents" />
        </div>
      </AdminModal>
    </div>
  );
};

export default DownloadsAdminPage;
