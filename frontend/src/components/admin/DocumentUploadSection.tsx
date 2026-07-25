import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { FileText, Trash2, Plus, Upload, Download, X } from 'lucide-react';

interface PageDocumentType {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  section: string;
  entityId: string;
  position: number;
  createdAt: string;
}

interface DocumentUploadSectionProps {
  section: string;
  entityId: string | null;
  label?: string;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  section,
  entityId,
  label = 'Documents',
}) => {
  const [documents, setDocuments] = useState<PageDocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchDocuments = async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/page-documents/${section}/${entityId}`);
      setDocuments(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      fetchDocuments();
    } else {
      setDocuments([]);
    }
  }, [entityId, section]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityId || !file || !title.trim()) return;

    setUploading(true);
    try {
      // Step 1: Upload file to /api/upload/single
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await apiClient.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = uploadRes.data.data.url;

      // Step 2: Create page document record
      await apiClient.post('/page-documents', {
        title: title.trim(),
        description: description.trim() || null,
        fileUrl,
        section,
        entityId,
        position: documents.length,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setIsFormOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await apiClient.delete(`/page-documents/${docId}`);
      fetchDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document.');
    }
  };

  if (!entityId) {
    return (
      <div className="bg-surface-50 rounded-xl border border-dashed border-surface-300 p-6 text-center">
        <Upload size={24} className="mx-auto mb-2 text-text-secondary opacity-50" />
        <p className="text-sm text-text-secondary">Save this item first to attach documents.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-surface-200 bg-surface-50 flex justify-between items-center">
        <h4 className="font-bold text-sm text-text flex items-center">
          <FileText size={16} className="mr-2 text-primary" />
          {label} ({documents.length})
        </h4>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="text-primary hover:text-primary-700 text-sm font-bold flex items-center transition"
        >
          {isFormOpen ? (
            <>
              <X size={14} className="mr-1" /> Cancel
            </>
          ) : (
            <>
              <Plus size={14} className="mr-1" /> Add Document
            </>
          )}
        </button>
      </div>

      {/* Upload Form */}
      {isFormOpen && (
        <form onSubmit={handleUpload} className="p-5 border-b border-surface-200 bg-primary-50/30 space-y-3">
          <div>
            <label className="block text-xs font-bold text-text mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meeting Minutes, Circular, Syllabus..."
              className="w-full px-3 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this document (optional)"
              className="w-full px-3 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text mb-1">File *</label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary-700 file:cursor-pointer file:transition"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition flex items-center disabled:opacity-50"
            >
              <Upload size={14} className="mr-1.5" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      )}

      {/* Documents List */}
      <div className="divide-y divide-surface-100">
        {loading ? (
          <div className="p-6 text-center text-sm text-text-secondary">Loading documents...</div>
        ) : documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-50 transition-colors">
              <div className="flex items-start min-w-0 flex-1">
                <FileText size={16} className="text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-sm text-text truncate">{doc.title}</div>
                  {doc.description && (
                    <div className="text-xs text-text-secondary mt-0.5 line-clamp-1">{doc.description}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-700 p-1.5 rounded-lg hover:bg-primary-50 transition"
                  title="Download"
                >
                  <Download size={16} />
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-text-secondary hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-text-secondary">
            No documents attached yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadSection;
