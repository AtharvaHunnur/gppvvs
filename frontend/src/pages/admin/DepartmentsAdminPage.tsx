import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const DepartmentsAdminPage = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    name: '',
    slug: '',
    description: '',
    program: 'BA',
    hodName: '',
    hodPhoto: '',
    image: '',
    isPublished: true,
    position: 0,
  };
  const [formData, setFormData] = useState(emptyForm);

  const fetchDepartments = async () => {
    try {
      const res = await apiClient.get('/departments');
      setDepartments(res.data.data);
    } catch (error) {
      console.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, name, slug });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: any) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name || '',
      slug: dept.slug || '',
      description: dept.description || '',
      program: dept.program || 'BA',
      hodName: dept.hodName || '',
      hodPhoto: dept.hodPhoto || '',
      image: dept.image || '',
      isPublished: dept.isPublished !== undefined ? dept.isPublished : true,
      position: dept.position || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/departments/${editingId}`, { ...formData, position: Number(formData.position) });
      } else {
        await apiClient.post('/departments', { ...formData, position: Number(formData.position) });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchDepartments();
    } catch (error) {
      alert('Failed to save department. Check that the slug is unique.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this department? This will also delete all associated faculty and courses!')) return;
    try {
      await apiClient.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      alert('Failed to delete department');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Manage Departments</h1>
          <p className="text-text-secondary text-sm">Add, edit, or remove academic departments and programs.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" /> Add Department
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50 text-text-secondary text-xs uppercase tracking-wider border-b border-surface-200">
              <th className="p-4 font-bold">Department</th>
              <th className="p-4 font-bold">Program</th>
              <th className="p-4 font-bold">HOD</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {departments.map(dept => (
              <tr key={dept.id} className="hover:bg-surface-50 transition-colors">
                <td className="p-4 flex items-center">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary mr-3">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-text">{dept.name}</div>
                    <div className="text-xs text-text-secondary">/{dept.slug}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-secondary/20 text-primary-900 text-xs font-bold rounded-full">{dept.program}</span>
                </td>
                <td className="p-4 text-sm text-text-secondary">{dept.hodName || '-'}</td>
                <td className="p-4 text-right">
                  <button onClick={() => openEditModal(dept)} className="text-text-secondary hover:text-primary p-2"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(dept.id)} className="text-text-secondary hover:text-red-500 p-2 ml-2"><Trash2 size={18} /></button>
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
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit Department' : 'Add Department'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Name *</label>
                  <input required value={formData.name} onChange={e => handleNameChange(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="English" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Slug (auto)</label>
                  <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-surface-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Program *</label>
                  <select required value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                    <option value="BA">B.A.</option>
                    <option value="BCOM">B.Com</option>
                    <option value="BSC">B.Sc.</option>
                    <option value="BCA">BCA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">HOD Name</label>
                  <input value={formData.hodName} onChange={e => setFormData({...formData, hodName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">HOD Photo URL</label>
                  <input value={formData.hodPhoto} onChange={e => setFormData({...formData, hodPhoto: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="/images/hod.jpg" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Department Image URL</label>
                  <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="/images/dept.jpg" />
                </div>
                <div className="col-span-2 flex items-center mt-2">
                  <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="mr-2 w-4 h-4" id="isPublished" />
                  <label htmlFor="isPublished" className="text-sm font-bold">Is Published</label>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Description *</label>
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={formData.description} 
                      onChange={(val) => setFormData({...formData, description: val})}
                      className="h-48 mb-10"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                          ['link', 'image', 'video'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update Department' : 'Save Department'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsAdminPage;
