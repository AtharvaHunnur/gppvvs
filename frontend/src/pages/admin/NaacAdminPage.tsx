import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Trash2, FileText, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const NaacAdminPage = () => {
  const [criteria, setCriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCriterionId, setActiveCriterionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyForm = { title: '', fileUrl: '', type: 'SSR' };
  const [formData, setFormData] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchCriteria = async () => {
    try { const res = await apiClient.get('/naac/criteria'); setCriteria(res.data.data); }
    catch (error) { console.error('Failed to fetch criteria'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCriteria(); }, []);

  const handleAddDocument = (criterionId: string) => { setActiveCriterionId(criterionId); setEditingId(null); setFormData(emptyForm); setFile(null); setIsModalOpen(true); };

  const handleEditDocument = (criterionId: string, doc: any) => {
    setActiveCriterionId(criterionId); setEditingId(doc.id);
    setFormData({ title: doc.title || '', fileUrl: doc.fileUrl || '', type: doc.type || 'SSR' });
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file && !formData.fileUrl) {
      alert('Please provide either a File URL or upload a File.');
      return;
    }
    
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
      
      const payload = { ...formData, fileUrl: finalFileUrl, criterionId: activeCriterionId };
      
      if (editingId) { await apiClient.put(`/naac/documents/${editingId}`, payload); }
      else { await apiClient.post('/naac/documents', payload); }
      setIsModalOpen(false); setEditingId(null); setFormData(emptyForm); setFile(null); fetchCriteria();
    } catch (error) { alert('Failed to save document'); }
    finally { setUploading(false); }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!window.confirm('Delete this document?')) return;
    try { await apiClient.delete(`/naac/documents/${docId}`); fetchCriteria(); }
    catch (error) { alert('Failed to delete document'); }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading NAAC data...</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="NAAC Document Management" description="Organize and upload SSR, AQAR, and criteria-wise documents." />

      <div className="space-y-4">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-surface-50 transition-colors" onClick={() => setExpandedCriterion(expandedCriterion === criterion.id ? null : criterion.id)}>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary font-bold">{criterion.number}</div>
                <div>
                  <h3 className="font-bold text-text">Criterion {criterion.number}: {criterion.title}</h3>
                  <p className="text-xs text-text-secondary">{criterion.documents?.length || 0} documents uploaded</p>
                </div>
              </div>
              <div className="text-text-secondary">{expandedCriterion === criterion.id ? <ChevronUp /> : <ChevronDown />}</div>
            </div>

            {expandedCriterion === criterion.id && (
              <div className="p-5 border-t border-surface-200 bg-surface-50 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider">NAAC Documents</h4>
                  <button onClick={(e) => { e.stopPropagation(); handleAddDocument(criterion.id); }} className="bg-white border border-primary text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition flex items-center shadow-sm">
                    <Plus size={16} className="mr-1" /> Add Document
                  </button>
                </div>

                {criterion.documents && criterion.documents.length > 0 ? (
                  <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-surface-100">
                        {criterion.documents.map((doc: any) => (
                          <tr key={doc.id} className="hover:bg-surface-50">
                            <td className="p-4 flex items-center">
                              <FileText size={16} className="text-primary mr-3" />
                              <div>
                                <div className="font-medium text-sm text-text">{doc.title}</div>
                                <div className="text-[10px] font-bold text-text-secondary mt-1 px-2 py-0.5 bg-surface-200 rounded inline-block">{doc.type}</div>
                              </div>
                            </td>
                            <td className="p-4 text-xs space-x-3">
                              <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">View</a>
                              <span className="text-surface-300">|</span>
                              <a href={doc.fileUrl} download target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">Download</a>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button onClick={() => handleEditDocument(criterion.id, doc)} className="text-text-secondary hover:text-primary p-2"><Edit size={16} /></button>
                              <button onClick={() => handleDeleteDocument(doc.id)} className="text-text-secondary hover:text-red-500 p-2"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-white border border-dashed border-surface-300 rounded-xl">
                    <p className="text-sm text-text-secondary">No documents uploaded for this criterion yet.</p>
                  </div>
                )}

                {/* Generic Document Upload Section */}
                <DocumentUploadSection section="naac" entityId={criterion.id} label="Additional Documents" />
              </div>
            )}
          </div>
        ))}
      </div>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit NAAC Document' : 'Upload NAAC Document'} maxWidth="max-w-md">
        <form onSubmit={handleSubmitDocument} className="space-y-4">
          <AdminFormField label="Document Title" required value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} placeholder="Metric 1.1.1 Supporting Doc" />
          
          <div>
            <label className="block text-sm font-bold text-text mb-1">File Upload (Optional if URL is provided)</label>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary-700 file:cursor-pointer file:transition" />
          </div>

          <AdminFormField label="Or File URL" value={formData.fileUrl} onChange={(v) => setFormData({ ...formData, fileUrl: v })} placeholder="https://..." />
          
          <AdminFormField label="Document Type" required type="select" value={formData.type} onChange={(v) => setFormData({ ...formData, type: v })} options={[
            { value: 'SSR', label: 'SSR' }, { value: 'AQAR', label: 'AQAR' }, { value: 'DVV', label: 'DVV Clarification' },
            { value: 'BEST_PRACTICES', label: 'Institutional Best Practices' }, { value: 'INSTITUTIONAL_VALUES', label: 'Institutional Values' },
            { value: 'FEEDBACK', label: 'Feedback' }, { value: 'COMMITTEE_REPORT', label: 'Committee Report' }, { value: 'OTHER', label: 'Other' },
          ]} />
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={uploading} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {uploading ? 'Saving...' : (editingId ? 'Update' : 'Upload')}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default NaacAdminPage;
