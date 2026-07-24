import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import AdminTable from '../../components/admin/AdminTable';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const DepartmentsAdminPage = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  const emptyForm = { name: '', slug: '', description: '', program: 'BA', hodName: '', hodPhoto: '', image: '', isPublished: true, position: 0 };
  const [formData, setFormData] = useState(emptyForm);

  const fetchDepartments = async () => {
    try { const res = await apiClient.get('/departments'); setDepartments(res.data.data); }
    catch (error) { console.error('Failed to fetch departments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, name, slug });
  };

  const openAddModal = () => { setEditingId(null); setFormData(emptyForm); setIsModalOpen(true); };

  const openEditModal = (dept: any) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name || '', slug: dept.slug || '', description: dept.description || '',
      program: dept.program || 'BA', hodName: dept.hodName || '', hodPhoto: dept.hodPhoto || '',
      image: dept.image || '', isPublished: dept.isPublished !== undefined ? dept.isPublished : true, position: dept.position || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) { await apiClient.put(`/departments/${editingId}`, { ...formData, position: Number(formData.position) }); }
      else { await apiClient.post('/departments', { ...formData, position: Number(formData.position) }); }
      setIsModalOpen(false); setEditingId(null); setFormData(emptyForm); fetchDepartments();
    } catch (error) { alert('Failed to save department. Check that the slug is unique.'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this department? This will also delete all associated faculty and courses!')) return;
    try { await apiClient.delete(`/departments/${id}`); if (selectedDeptId === id) setSelectedDeptId(null); fetchDepartments(); }
    catch (error) { alert('Failed to delete department'); }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading departments...</div>;

  const columns = [
    {
      key: 'name', label: 'Department',
      render: (row: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary mr-3"><Building2 size={20} /></div>
          <div>
            <div className="font-bold text-text">{row.name}</div>
            <div className="text-xs text-text-secondary">/{row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'program', label: 'Program',
      render: (row: any) => <span className="px-2.5 py-1 bg-secondary/20 text-primary-900 text-xs font-bold rounded-full">{row.program}</span>,
    },
    { key: 'hodName', label: 'HOD', render: (row: any) => <span className="text-sm text-text-secondary">{row.hodName || '-'}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right' as const,
      render: (row: any) => (
          <button onClick={() => openEditModal(row)} className="text-text-secondary hover:text-primary p-2"><Edit size={18} /></button>
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-red-500 p-2 ml-2"><Trash2 size={18} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Manage Departments" description="Add, edit, or remove academic departments and programs." actionLabel="Add Department" actionIcon={Plus} onAction={openAddModal} />
      <AdminTable columns={columns} data={departments} emptyMessage="No departments found." />

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Department' : 'Add Department'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <AdminFormField label="Name" required value={formData.name} onChange={(v) => handleNameChange(v)} placeholder="English" />
            <AdminFormField label="Slug (auto)" value={formData.slug} onChange={(v) => setFormData({ ...formData, slug: v })} disabled />
            <AdminFormField label="Program" required type="select" value={formData.program} onChange={(v) => setFormData({ ...formData, program: v })} options={[{ value: 'BA', label: 'B.A.' }, { value: 'BCOM', label: 'B.Com' }, { value: 'BSC', label: 'B.Sc.' }]} />
            <AdminFormField label="HOD Name" value={formData.hodName} onChange={(v) => setFormData({ ...formData, hodName: v })} />
            <AdminFormField label="HOD Photo URL" value={formData.hodPhoto} onChange={(v) => setFormData({ ...formData, hodPhoto: v })} placeholder="/images/hod.jpg" />
            <AdminFormField label="Department Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} placeholder="/images/dept.jpg" />
            <AdminFormField label="Is Published" type="checkbox" value={formData.isPublished} onChange={(v) => setFormData({ ...formData, isPublished: v })} className="col-span-2 mt-2" />
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1">Description *</label>
              <div className="bg-white rounded-lg border overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(val) => setFormData({ ...formData, description: val })}
                  className="h-48 mb-10"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                      ['link', 'image', 'video'],
                      ['clean'],
                    ],
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

        <div className="pt-6 mt-6 border-t border-surface-200">
          <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Documents</h4>
          <DocumentUploadSection section="departments" entityId={editingId} label="Department Documents" />
        </div>
      </AdminModal>
    </div>
  );
};

export default DepartmentsAdminPage;
