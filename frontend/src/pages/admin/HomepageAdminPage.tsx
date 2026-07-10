import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Trash2, Edit, Save } from 'lucide-react';

const HomepageAdminPage = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [quicklinks, setQuicklinks] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for Quick Links form
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ title: '', url: '', icon: '', isVisible: true, position: 0 });

  // States for Stats form
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [statForm, setStatForm] = useState({ label: '', value: '', icon: '', position: 0 });

  const fetchData = async () => {
    try {
      const [secRes, linksRes, statsRes] = await Promise.all([
        apiClient.get('/homepage/sections'),
        apiClient.get('/homepage/quicklinks'),
        apiClient.get('/homepage/statistics')
      ]);
      setSections(secRes.data.data);
      setQuicklinks(linksRes.data.data);
      setStatistics(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch homepage data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick Links Handlers
  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/homepage/quicklinks', { ...linkForm, position: Number(linkForm.position) });
      setIsLinkModalOpen(false);
      setLinkForm({ title: '', url: '', icon: '', isVisible: true, position: 0 });
      fetchData();
    } catch (error) {
      alert('Failed to add link');
    }
  };
  const handleLinkDelete = async (id: string) => {
    if (!window.confirm('Delete link?')) return;
    try {
      await apiClient.delete(`/homepage/quicklinks/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete');
    }
  };
  const handleLinkToggle = async (id: string, current: boolean) => {
    try {
      await apiClient.put(`/homepage/quicklinks/${id}`, { isVisible: !current });
      fetchData();
    } catch (error) {
      alert('Failed to update');
    }
  };

  // Stats Handlers
  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/homepage/statistics', { ...statForm, position: Number(statForm.position) });
      setIsStatModalOpen(false);
      setStatForm({ label: '', value: '', icon: '', position: 0 });
      fetchData();
    } catch (error) {
      alert('Failed to add stat');
    }
  };
  const handleStatDelete = async (id: string) => {
    if (!window.confirm('Delete stat?')) return;
    try {
      await apiClient.delete(`/homepage/statistics/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <h1 className="text-2xl font-bold text-primary font-heading">Homepage Builder</h1>
        <p className="text-text-secondary text-sm">Manage dynamic sections, quick links, and institutional statistics on the main homepage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Quick Links Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-surface-200 flex justify-between items-center bg-surface-50">
            <h2 className="font-bold text-lg text-primary">Quick Links</h2>
            <button 
              onClick={() => setIsLinkModalOpen(true)}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary-700 transition"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="p-6 flex-grow overflow-auto">
            {quicklinks.length > 0 ? (
              <div className="space-y-3">
                {quicklinks.map(link => (
                  <div key={link.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${link.isVisible ? 'bg-white border-surface-200' : 'bg-surface-50 border-dashed border-surface-300 opacity-60'}`}>
                    <div>
                      <div className="font-bold text-text text-sm">{link.title}</div>
                      <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-primary underline truncate max-w-[200px] block mt-1">{link.url}</a>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleLinkToggle(link.id, link.isVisible)} className={`text-xs px-2 py-1 rounded font-bold ${link.isVisible ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-text-secondary'}`}>
                        {link.isVisible ? 'Visible' : 'Hidden'}
                      </button>
                      <button onClick={() => handleLinkDelete(link.id)} className="text-surface-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary text-center">No quick links added.</p>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-surface-200 flex justify-between items-center bg-surface-50">
            <h2 className="font-bold text-lg text-primary">Statistics Counters</h2>
            <button 
              onClick={() => setIsStatModalOpen(true)}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary-700 transition"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="p-6 flex-grow overflow-auto">
            {statistics.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {statistics.map(stat => (
                  <div key={stat.id} className="bg-primary text-white p-6 rounded-xl relative group text-center">
                    <button onClick={() => handleStatDelete(stat.id)} className="absolute top-2 right-2 text-white/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
                    <div className="text-3xl font-bold font-heading mb-1">{stat.value}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary text-center">No statistics added.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">Add Quick Link</h2>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleLinkSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Title *</label>
                <input required value={linkForm.title} onChange={e => setLinkForm({...linkForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Student Portal" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">URL *</label>
                <input required value={linkForm.url} onChange={e => setLinkForm({...linkForm, url: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Position</label>
                <input type="number" required value={linkForm.position} onChange={e => setLinkForm({...linkForm, position: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsLinkModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStatModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">Add Statistic</h2>
              <button onClick={() => setIsStatModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleStatSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Label *</label>
                <input required value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Students Enrolled" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Value (Text) *</label>
                <input required value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="10,000+" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Position</label>
                <input type="number" required value={statForm.position} onChange={e => setStatForm({...statForm, position: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsStatModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageAdminPage;
