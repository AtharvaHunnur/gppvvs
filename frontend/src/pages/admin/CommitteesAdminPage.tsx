import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, Users, UserPlus } from 'lucide-react';

const CommitteesAdminPage = () => {
  const [committees, setCommittees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [activeCommitteeId, setActiveCommitteeId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyForm = { name: '', description: '', position: 0 };
  const [formData, setFormData] = useState(emptyForm);
  const [memberFormData, setMemberFormData] = useState({ name: '', role: '', designation: '', position: 0 });

  const fetchCommittees = async () => {
    try {
      const res = await apiClient.get('/committees');
      setCommittees(res.data.data);
    } catch (error) {
      console.error('Failed to fetch committees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (committee: any) => {
    setEditingId(committee.id);
    setFormData({
      name: committee.name || '',
      description: committee.description || '',
      position: committee.position || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/committees/${editingId}`, { ...formData, position: Number(formData.position) });
      } else {
        await apiClient.post('/committees', { ...formData, position: Number(formData.position) });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchCommittees();
    } catch (error) {
      alert('Failed to save committee');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this committee and all its members?')) return;
    try {
      await apiClient.delete(`/committees/${id}`);
      fetchCommittees();
    } catch (error) {
      alert('Failed to delete committee');
    }
  };

  const handleAddMember = (committeeId: string) => {
    setActiveCommitteeId(committeeId);
    setMemberFormData({ name: '', role: '', designation: '', position: 0 });
    setIsMemberModalOpen(true);
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/committees/${activeCommitteeId}/members`, {
        ...memberFormData,
        position: Number(memberFormData.position)
      });
      setIsMemberModalOpen(false);
      fetchCommittees();
    } catch (error) {
      alert('Failed to add member');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Remove this member from the committee?')) return;
    try {
      await apiClient.delete(`/committees/members/${id}`);
      fetchCommittees();
    } catch (error) {
      alert('Failed to delete member');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Manage Committees</h1>
          <p className="text-text-secondary text-sm">Organize institutional committees, cells, and their members.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" /> Add Committee
        </button>
      </div>

      <div className="space-y-6">
        {committees.map(committee => (
          <div key={committee.id} className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="p-6 border-b border-surface-200 flex justify-between items-start bg-surface-50">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">{committee.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">{committee.description || 'No description provided.'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => openEditModal(committee)} className="p-2 text-text-secondary hover:text-primary bg-white rounded-lg border border-surface-200 shadow-sm"><Edit size={16} /></button>
                <button onClick={() => handleDelete(committee.id)} className="p-2 text-text-secondary hover:text-red-500 bg-white rounded-lg border border-surface-200 shadow-sm"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Committee Members</h4>
                <button 
                  onClick={() => handleAddMember(committee.id)}
                  className="bg-surface-100 hover:bg-surface-200 text-text px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center"
                >
                  <UserPlus size={16} className="mr-1" /> Add Member
                </button>
              </div>

              {committee.members && committee.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {committee.members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-surface-100">
                      <div>
                        <div className="font-bold text-text text-sm">{member.name}</div>
                        <div className="text-primary text-xs font-bold mt-0.5">{member.role}</div>
                        {member.designation && <div className="text-text-secondary text-xs mt-0.5">{member.designation}</div>}
                      </div>
                      <button onClick={() => handleDeleteMember(member.id)} className="text-text-secondary hover:text-red-500 p-1.5">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-text-secondary text-sm bg-surface-50 rounded-xl border border-dashed border-surface-300">
                  No members added yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Committee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit Committee' : 'Add Committee'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Committee Name *</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Anti-Ragging Committee" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg resize-none" placeholder="Purpose and responsibilities..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Display Position</label>
                <input type="number" required value={formData.position} onChange={e => setFormData({...formData, position: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">Add Committee Member</h2>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleMemberSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Name *</label>
                <input required value={memberFormData.name} onChange={e => setMemberFormData({...memberFormData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Dr. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Committee Role *</label>
                <input required value={memberFormData.role} onChange={e => setMemberFormData({...memberFormData, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Chairman, Convener, Member..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Designation</label>
                <input value={memberFormData.designation} onChange={e => setMemberFormData({...memberFormData, designation: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Principal / HOD" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Display Position</label>
                <input type="number" required value={memberFormData.position} onChange={e => setMemberFormData({...memberFormData, position: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteesAdminPage;
