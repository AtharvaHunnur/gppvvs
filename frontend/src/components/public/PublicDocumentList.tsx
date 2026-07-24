import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface PageDocumentType {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  createdAt: string;
}

interface PublicDocumentListProps {
  section: string;
  entityId: string;
  title?: string;
}

const PublicDocumentList: React.FC<PublicDocumentListProps> = ({ 
  section, 
  entityId, 
  title = "Related Documents" 
}) => {
  const [documents, setDocuments] = useState<PageDocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!entityId) return;
      setLoading(true);
      setError(false);
      try {
        const res = await apiClient.get(`/page-documents/${section}/${entityId}`);
        setDocuments(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch documents:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [section, entityId]);

  if (loading) {
    return (
      <div className="py-6 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-surface-200 pt-8">
      <h3 className="text-xl font-bold text-text font-heading mb-6 flex items-center">
        <FileText className="mr-2 text-primary" size={24} />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-surface-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <h4 className="font-bold text-text text-sm group-hover:text-primary transition-colors line-clamp-2">
                {doc.title}
              </h4>
              {doc.description && (
                <p className="text-xs text-text-secondary mt-2 line-clamp-2">
                  {doc.description}
                </p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-between">
              <span className="text-xs font-mono text-surface-400">
                {new Date(doc.createdAt).toLocaleDateString()}
              </span>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm font-bold text-primary hover:text-secondary transition-colors"
                title="Download Document"
              >
                <Download size={16} className="mr-1" /> Download
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PublicDocumentList;
