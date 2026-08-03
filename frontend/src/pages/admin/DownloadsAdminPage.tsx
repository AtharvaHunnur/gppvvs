import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Trash2, FileDown, Save, Edit2 } from 'lucide-react';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const DownloadsAdminPage = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const emptyForm = { title: '', fileUrl: '', category: 'OTHER' };
  const [formData, setFormData] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchDownloads = async () => {
    try {
      const res = await apiClient.get('/downloads');
      setDownloads(res.data.data);
      if (!editingId && res.data.data.length > 0) {
        handleSelect(res.data.data[0]);
      } else if (!editingId) {
        handleAddNew();
      }
    } catch (error) { console.error('Failed to fetch downloads'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDownloads(); }, []);

  const showMsg = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSelect = (doc: any) => {
    setEditingId(doc.id);
    setFormData({ title: doc.title || '', fileUrl: doc.fileUrl || '', category: doc.category || 'OTHER' });
    setFile(null);
    setMessage({ type: '', text: '' });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFile(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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

      if (editingId) {
        await apiClient.put(`/downloads/${editingId}`, payload);
        showMsg('success', 'Document updated successfully!');
      } else {
        const res = await apiClient.post('/downloads', payload);
        setEditingId(res.data.data.id);
        showMsg('success', 'Document added successfully!');
      }
      fetchDownloads();
    } catch (error: any) {
      showMsg('error', error.response?.data?.message || 'Failed to save document.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this document?')) return;
    try {
      await apiClient.delete(`/downloads/${id}`);
      if (editingId === id) {
        handleAddNew();
      }
      fetchDownloads();
      showMsg('success', 'Document deleted.');
    } catch (error) {
      showMsg('error', 'Failed to delete document.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text flex items-center">
          <FileDown className="mr-3 text-primary" size={28} /> Manage Downloads
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-surface-50 border-r border-surface-200 p-4 flex flex-col max-h-[800px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Documents</h3>
            <button onClick={handleAddNew} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md transition-colors" title="Add New">
              <Plus size={18} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {loading ? (
              <div className="text-center py-4 text-text-secondary text-sm">Loading...</div>
            ) : downloads.length === 0 ? (
              <div className="text-center py-4 text-text-secondary text-sm">No documents found.</div>
            ) : (
              downloads.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleSelect(doc)}
                  className={`w-full flex items-center justify-between px-3 py-3 text-sm font-bold rounded-xl transition-colors cursor-pointer group ${
                    editingId === doc.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-text hover:bg-surface-200 border border-surface-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    {doc.title}
                    <div className={`text-xs font-normal truncate ${editingId === doc.id ? 'text-primary-100' : 'text-text-secondary'}`}>
                      {doc.category}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                      editingId === doc.id ? 'text-white hover:bg-white/20' : 'text-red-400 hover:bg-red-50 hover:text-red-600'
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
            {editingId ? `Editing: ${formData.title}` : 'Add New Document'}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <AdminFormField label="Title" required value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="B.Com Syllabus 2026" />

            <div>
              <label className="block text-sm font-bold text-text mb-2">Upload File (Optional)</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 cursor-pointer"
              />
              <p className="text-xs text-text-secondary mt-1">Select a file from your computer, or paste an external URL below.</p>
            </div>

            <AdminFormField label="External URL" required={!file && !formData.fileUrl} value={formData.fileUrl} onChange={(v) => setFormData({ ...formData, fileUrl: v })} placeholder="https://..." hint="Leave empty if you uploaded a file above." />

            <AdminFormField label="Category" required type="select" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} options={[{ value: 'OTHER', label: 'Other' }, { value: 'SYLLABUS', label: 'Syllabus' }, { value: 'CIRCULAR', label: 'Circular' }, { value: 'REPORT', label: 'Report' }, { value: 'FORM', label: 'Form' }, { value: 'LIBRARY', label: 'Library' }]} />

            <div className="flex justify-end pt-4 border-t border-surface-200">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center shadow-md">
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : (editingId ? 'Update Document' : 'Add Document')}
              </button>
            </div>
          </form>

          {editingId && (
            <div className="mt-8 pt-8 border-t border-surface-200">
              <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Related Documents</h4>
              <DocumentUploadSection section="downloads" entityId={editingId} label="Related Documents" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadsAdminPage;
