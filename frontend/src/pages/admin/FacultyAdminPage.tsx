import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, Search, User } from 'lucide-react';

const FacultyAdminPage = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyForm = {
    name: '',
    designation: '',
    qualification: '',
    specialization: '',
    email: '',
    phone: '',
    departmentId: '',
    position: 0,
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const [facRes, deptRes] = await Promise.all([
        apiClient.get('/faculty'),
        apiClient.get('/departments')
      ]);
      setFaculty(facRes.data.data);
      setDepartments(deptRes.data.data);
      
      if (deptRes.data.data.length > 0) {
        setFormData(prev => ({ ...prev, departmentId: deptRes.data.data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, departmentId: departments[0]?.id || '' });
    setIsModalOpen(true);
  };

  const openEditModal = (fac: any) => {
    setEditingId(fac.id);
    setFormData({
      name: fac.name || '',
      designation: fac.designation || '',
      qualification: fac.qualification || '',
      specialization: fac.specialization || '',
      email: fac.email || '',
      phone: fac.phone || '',
      departmentId: fac.departmentId || fac.department?.id || '',
      position: fac.position || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/faculty/${editingId}`, { ...formData, position: Number(formData.position) });
      } else {
        await apiClient.post('/faculty', { ...formData, position: Number(formData.position) });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ ...emptyForm, departmentId: departments[0]?.id || '' });
      fetchData();
    } catch (error) {
      alert('Failed to save faculty.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try {
      await apiClient.delete(`/faculty/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Manage Faculty</h1>
          <p className="text-text-secondary text-sm">Add, edit, or remove teaching staff.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" /> Add Faculty
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="p-4 border-b border-surface-200 bg-surface-50 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <input type="text" placeholder="Search faculty..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:border-primary text-sm" />
            <Search className="absolute left-3 top-2.5 text-text-secondary" size={16} />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50 text-text-secondary text-xs uppercase tracking-wider border-b border-surface-200">
              <th className="p-4 font-bold">Faculty Member</th>
              <th className="p-4 font-bold">Department</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {faculty.map(fac => (
              <tr key={fac.id} className="hover:bg-surface-50 transition-colors">
                <td className="p-4 flex items-center">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary mr-3">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-text">{fac.name}</div>
                    <div className="text-xs text-primary font-medium">{fac.designation}</div>
                  </div>
                </td>
                <td className="p-4 text-sm text-text-secondary">
                  <div className="font-medium text-text">{fac.department?.name}</div>
                  <div className="text-xs">{fac.department?.program}</div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openEditModal(fac)} className="text-text-secondary hover:text-primary p-2"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(fac.id)} className="text-text-secondary hover:text-red-500 p-2 ml-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit Faculty Member' : 'Add Faculty Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Dr. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Designation *</label>
                  <input required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Professor" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Department *</label>
                  <select required value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name} ({d.program})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Qualification</label>
                  <input value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Ph.D, M.Sc" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Specialization</label>
                  <input value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update Faculty' : 'Save Faculty'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAdminPage;
