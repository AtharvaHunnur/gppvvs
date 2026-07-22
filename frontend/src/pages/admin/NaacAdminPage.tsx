import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const NaacAdminPage = () => {
  const [criteria, setCriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);
  
  // Document upload modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCriterionId, setActiveCriterionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyForm = { title: '', fileUrl: '', type: 'SSR' };
  const [formData, setFormData] = useState(emptyForm);

  const fetchCriteria = async () => {
    try {
      const res = await apiClient.get('/naac/criteria');
      setCriteria(res.data.data);
    } catch (error) {
      console.error('Failed to fetch criteria');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const handleAddDocument = (criterionId: string) => {
    setActiveCriterionId(criterionId);
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleEditDocument = (criterionId: string, doc: any) => {
    setActiveCriterionId(criterionId);
    setEditingId(doc.id);
    setFormData({
      title: doc.title || '',
      fileUrl: doc.fileUrl || '',
      type: doc.type || 'SSR'
    });
    setIsModalOpen(true);
  };

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/naac/documents/${editingId}`, {
          ...formData,
          criterionId: activeCriterionId
        });
      } else {
        await apiClient.post('/naac/documents', {
          ...formData,
          criterionId: activeCriterionId
        });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchCriteria();
    } catch (error) {
      alert('Failed to save document');
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await apiClient.delete(`/naac/documents/${docId}`);
      fetchCriteria();
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <h1 className="text-2xl font-bold text-primary font-heading">NAAC Document Management</h1>
        <p className="text-text-secondary text-sm">Organize and upload SSR, AQAR, and criteria-wise documents.</p>
      </div>

      <div className="space-y-4">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
            {/* Header / Accordion Toggle */}
            <div 
              className="p-5 flex justify-between items-center cursor-pointer hover:bg-surface-50 transition-colors"
              onClick={() => setExpandedCriterion(expandedCriterion === criterion.id ? null : criterion.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary font-bold">
                  {criterion.number}
                </div>
                <div>
                  <h3 className="font-bold text-text">Criterion {criterion.number}: {criterion.title}</h3>
                  <p className="text-xs text-text-secondary">{criterion.documents?.length || 0} documents uploaded</p>
                </div>
              </div>
              <div className="text-text-secondary">
                {expandedCriterion === criterion.id ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCriterion === criterion.id && (
              <div className="p-5 border-t border-surface-200 bg-surface-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Documents</h4>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddDocument(criterion.id); }}
                    className="bg-white border border-primary text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition flex items-center shadow-sm"
                  >
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
                                <div className="text-[10px] font-bold text-text-secondary mt-1 px-2 py-0.5 bg-surface-200 rounded inline-block">
                                  {doc.type}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-xs text-primary underline truncate max-w-[200px]">
                              <a href={doc.fileUrl} target="_blank" rel="noreferrer">View File</a>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button onClick={() => handleEditDocument(criterion.id, doc)} className="text-text-secondary hover:text-primary p-2">
                                <Plus size={16} className="hidden" /> {/* just to match width or I can import Edit */}
                                <span className="text-sm font-bold">Edit</span>
                              </button>
                              <button onClick={() => handleDeleteDocument(doc.id)} className="text-text-secondary hover:text-red-500 p-2">
                                <Trash2 size={16} />
                              </button>
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
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit NAAC Document' : 'Upload NAAC Document'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmitDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Document Title *</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Metric 1.1.1 Supporting Doc" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">File URL *</label>
                <input required value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Document Type *</label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                  <option value="SSR">SSR</option>
                  <option value="AQAR">AQAR</option>
                  <option value="DVV">DVV Clarification</option>
                  <option value="BEST_PRACTICES">Institutional Best Practices</option>
                  <option value="INSTITUTIONAL_VALUES">Institutional Values</option>
                  <option value="FEEDBACK">Feedback</option>
                  <option value="COMMITTEE_REPORT">Committee Report</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NaacAdminPage;
