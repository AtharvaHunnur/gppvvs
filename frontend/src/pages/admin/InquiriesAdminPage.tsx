import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { format } from 'date-fns';
import { Mail, Phone, Trash2, CheckCircle, Clock } from 'lucide-react';

const InquiriesAdminPage = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await apiClient.get('/inquiries');
      setInquiries(res.data.data);
    } catch (error) {
      console.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'NEW' ? 'READ' : currentStatus === 'READ' ? 'RESPONDED' : 'NEW';
    try {
      await apiClient.patch(`/inquiries/${id}/status`, { status: newStatus });
      fetchInquiries();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry? This cannot be undone.')) return;
    try {
      await apiClient.delete(`/inquiries/${id}`);
      fetchInquiries();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Inquiries & Messages</h1>
          <p className="text-text-secondary text-sm">Manage messages sent from the Contact Us page.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50 text-text-secondary text-xs uppercase tracking-wider border-b border-surface-200">
              <th className="p-4 font-bold">Contact Details</th>
              <th className="p-4 font-bold">Subject & Message</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {inquiries.map(inquiry => (
              <tr key={inquiry.id} className={`hover:bg-surface-50 transition-colors ${inquiry.status === 'RESPONDED' ? 'opacity-60 bg-surface-50/50' : ''}`}>
                <td className="p-4 align-top w-1/4">
                  <div className="font-bold text-text mb-1">{inquiry.name}</div>
                  <div className="text-xs text-text-secondary flex items-center mb-1">
                    <Mail size={12} className="mr-1" /> {inquiry.email}
                  </div>
                  {inquiry.phone && (
                    <div className="text-xs text-text-secondary flex items-center">
                      <Phone size={12} className="mr-1" /> {inquiry.phone}
                    </div>
                  )}
                  <div className="text-[10px] text-surface-400 mt-2">
                    {format(new Date(inquiry.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </td>
                <td className="p-4 align-top w-1/2">
                  <span className="inline-block px-2 py-0.5 bg-surface-200 text-text-secondary text-[10px] font-bold rounded mb-2">
                    {inquiry.subject}
                  </span>
                  <p className="text-sm text-text whitespace-pre-wrap">{inquiry.message}</p>
                </td>
                <td className="p-4 align-top">
                  <button 
                    onClick={() => handleUpdateStatus(inquiry.id, inquiry.status)}
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      inquiry.status === 'RESPONDED' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : inquiry.status === 'READ'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    {inquiry.status === 'RESPONDED' ? (
                      <><CheckCircle size={14} className="mr-1" /> Responded</>
                    ) : inquiry.status === 'READ' ? (
                      <><CheckCircle size={14} className="mr-1" /> Read</>
                    ) : (
                      <><Clock size={14} className="mr-1" /> New</>
                    )}
                  </button>
                </td>
                <td className="p-4 align-top text-right">
                  <button onClick={() => handleDelete(inquiry.id)} className="text-text-secondary hover:text-red-500 p-2 bg-surface-100 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr><td colSpan={4} className="p-12 text-center text-text-secondary">No inquiries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InquiriesAdminPage;
