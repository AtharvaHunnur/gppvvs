import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import AdminTable from '../../components/admin/AdminTable';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const FacultyAdminPage = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);

  const emptyForm = { name: '', designation: '', qualification: '', specialization: '', email: '', phone: '', departmentId: '', position: 0 };
  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const [facRes, deptRes] = await Promise.all([apiClient.get('/faculty'), apiClient.get('/departments')]);
      setFaculty(facRes.data.data);
      setDepartments(deptRes.data.data);
      if (deptRes.data.data.length > 0) setFormData(prev => ({ ...prev, departmentId: deptRes.data.data[0].id }));
    } catch (error) { console.error('Failed to fetch data', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => { setEditingId(null); setFormData({ ...emptyForm, departmentId: departments[0]?.id || '' }); setIsModalOpen(true); };

  const openEditModal = (fac: any) => {
    setEditingId(fac.id);
    setFormData({
      name: fac.name || '', designation: fac.designation || '', qualification: fac.qualification || '',
      specialization: fac.specialization || '', email: fac.email || '', phone: fac.phone || '',
      departmentId: fac.departmentId || fac.department?.id || '', position: fac.position || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) { await apiClient.put(`/faculty/${editingId}`, { ...formData, position: Number(formData.position) }); }
      else { await apiClient.post('/faculty', { ...formData, position: Number(formData.position) }); }
      setIsModalOpen(false); setEditingId(null); setFormData({ ...emptyForm, departmentId: departments[0]?.id || '' }); fetchData();
    } catch (error) { alert('Failed to save faculty.'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try { await apiClient.delete(`/faculty/${id}`); if (selectedFacultyId === id) setSelectedFacultyId(null); fetchData(); }
    catch (error) { console.error('Failed to delete'); }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading faculty...</div>;

  const columns = [
    {
      key: 'name', label: 'Faculty Member',
      render: (row: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary mr-3"><User size={20} /></div>
          <div>
            <div className="font-bold text-text">{row.name}</div>
            <div className="text-xs text-primary font-medium">{row.designation}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'department', label: 'Department',
      render: (row: any) => (
        <div>
          <div className="font-medium text-text text-sm">{row.department?.name}</div>
          <div className="text-xs text-text-secondary">{row.department?.program}</div>
        </div>
      ),
    },
    {
      key: 'actions', label: 'Actions', align: 'right' as const,
      render: (row: any) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => setSelectedFacultyId(selectedFacultyId === row.id ? null : row.id)} className={`p-2 rounded-lg transition-colors ${selectedFacultyId === row.id ? 'text-primary bg-primary-50' : 'text-text-secondary hover:text-primary'}`} title="Manage Documents">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          </button>
          <button onClick={() => openEditModal(row)} className="text-text-secondary hover:text-primary p-2"><Edit size={18} /></button>
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-red-500 p-2 ml-2"><Trash2 size={18} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Manage Faculty" description="Add, edit, or remove teaching staff." actionLabel="Add Faculty" actionIcon={Plus} onAction={openAddModal} />
      <AdminTable columns={columns} data={faculty} emptyMessage="No faculty found." />

      {selectedFacultyId && (
        <DocumentUploadSection section="faculty" entityId={selectedFacultyId} label="Faculty Documents" />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Faculty Member' : 'Add Faculty Member'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <AdminFormField label="Name" required value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="Dr. John Doe" />
            <AdminFormField label="Designation" required value={formData.designation} onChange={(v) => setFormData({ ...formData, designation: v })} placeholder="Professor" />
            <AdminFormField label="Department" required type="select" value={formData.departmentId} onChange={(v) => setFormData({ ...formData, departmentId: v })} options={departments.map(d => ({ value: d.id, label: `${d.name} (${d.program})` }))} />
            <AdminFormField label="Qualification" value={formData.qualification} onChange={(v) => setFormData({ ...formData, qualification: v })} placeholder="Ph.D, M.Sc" />
            <AdminFormField label="Specialization" value={formData.specialization} onChange={(v) => setFormData({ ...formData, specialization: v })} className="col-span-2" />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update Faculty' : 'Save Faculty'}</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default FacultyAdminPage;
