import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Trash2, User, Save, Loader2, Edit2 } from 'lucide-react';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';
import ImageUploadField from '../../components/admin/ImageUploadField';

const FacultyAdminPage = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const emptyForm = { name: '', designation: '', qualification: '', specialization: '', email: '', phone: '', departmentId: '', position: 0, photo: '', experience: '', publications: '', researchInterests: '', isPublished: true };
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [facRes, deptRes] = await Promise.all([apiClient.get('/faculty'), apiClient.get('/departments')]);
      setFaculty(facRes.data.data);
      setDepartments(deptRes.data.data);
      if (!editingId && facRes.data.data.length > 0) {
        handleSelect(facRes.data.data[0]);
      } else if (!editingId) {
        handleAddNew(deptRes.data.data[0]?.id || '');
      }
    } catch (error) { console.error('Failed to fetch data', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const showMsg = (type: string, text: string) => { 
    setMessage({ type, text }); 
    setTimeout(() => setMessage({ type: '', text: '' }), 5000); 
  };

  const handleSelect = (fac: any) => {
    setEditingId(fac.id);
    setFormData({
      name: fac.name || '', designation: fac.designation || '', qualification: fac.qualification || '',
      specialization: fac.specialization || '', email: fac.email || '', phone: fac.phone || '',
      departmentId: fac.departmentId || fac.department?.id || '', position: fac.position || 0,
      photo: fac.photo || '', experience: fac.experience || '', publications: fac.publications || '',
      researchInterests: fac.researchInterests || '', isPublished: fac.isPublished !== undefined ? fac.isPublished : true,
    });
    setMessage({ type: '', text: '' });
  };

  const handleAddNew = (defaultDeptId?: string) => {
    setEditingId(null);
    setFormData({ ...emptyForm, departmentId: defaultDeptId || departments[0]?.id || '' });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) { 
        await apiClient.put(`/faculty/${editingId}`, { ...formData, position: Number(formData.position) }); 
        showMsg('success', 'Faculty updated successfully!');
      } else { 
        const res = await apiClient.post('/faculty', { ...formData, position: Number(formData.position) }); 
        setEditingId(res.data.data.id);
        showMsg('success', 'Faculty created successfully!');
      }
      fetchData();
    } catch (error: any) { 
      showMsg('error', error.response?.data?.message || 'Failed to save faculty.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this faculty member?')) return;
    try { 
      await apiClient.delete(`/faculty/${id}`); 
      if (editingId === id) {
        handleAddNew();
      }
      fetchData(); 
      showMsg('success', 'Faculty member deleted.');
    }
    catch (error) { 
      showMsg('error', 'Failed to delete faculty member.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text flex items-center">
          <User className="mr-3 text-primary" size={28} /> Manage Faculty
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-surface-50 border-r border-surface-200 p-4 flex flex-col max-h-[800px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Faculty</h3>
            <button onClick={() => handleAddNew()} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md transition-colors" title="Add New">
              <Plus size={18} />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {loading ? (
              <div className="text-center py-4 text-text-secondary text-sm">Loading...</div>
            ) : faculty.length === 0 ? (
              <div className="text-center py-4 text-text-secondary text-sm">No faculty found.</div>
            ) : (
              faculty.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => handleSelect(fac)}
                  className={`w-full flex items-center justify-between px-3 py-3 text-sm font-bold rounded-xl transition-colors cursor-pointer group ${
                    editingId === fac.id 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-text hover:bg-surface-200 border border-surface-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    {fac.name}
                    <div className={`text-xs font-normal truncate ${editingId === fac.id ? 'text-primary-100' : 'text-text-secondary'}`}>
                      {fac.designation}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(fac.id, e)}
                    className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                      editingId === fac.id ? 'text-white hover:bg-white/20' : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                    }`}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col max-h-[800px] overflow-y-auto">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-semibold shadow-sm mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="mb-6 flex items-center text-lg font-bold text-primary font-heading border-b border-surface-200 pb-4">
            <Edit2 size={20} className="mr-2" />
            {editingId ? `Editing: ${formData.name}` : 'Create New Faculty Member'}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField label="Name" required value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="Dr. John Doe" />
              <AdminFormField label="Designation" required value={formData.designation} onChange={(v) => setFormData({ ...formData, designation: v })} placeholder="Professor" />
              <AdminFormField label="Department" required type="select" value={formData.departmentId} onChange={(v) => setFormData({ ...formData, departmentId: v })} options={departments.map(d => ({ value: d.id, label: `${d.name} (${d.program})` }))} />
              <AdminFormField label="Position (Order)" type="number" value={formData.position.toString()} onChange={(v) => setFormData({ ...formData, position: Number(v) })} />
              <AdminFormField label="Qualification" value={formData.qualification} onChange={(v) => setFormData({ ...formData, qualification: v })} placeholder="Ph.D, M.Sc" />
              <AdminFormField label="Specialization" value={formData.specialization} onChange={(v) => setFormData({ ...formData, specialization: v })} />
              <AdminFormField label="Experience" value={formData.experience} onChange={(v) => setFormData({ ...formData, experience: v })} placeholder="10 Years" />
              <AdminFormField label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
              <AdminFormField label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
              <AdminFormField label="Is Published" type="checkbox" value={formData.isPublished} onChange={(v) => setFormData({ ...formData, isPublished: v })} />
            </div>

            <div className="pt-4 border-t border-surface-200">
              <ImageUploadField 
                label="Profile Photo"
                value={formData.photo ? [formData.photo] : []}
                onChange={(urls) => setFormData({ ...formData, photo: urls[0] || '' })}
                multiple={false}
              />
            </div>

            <div className="pt-4 border-t border-surface-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField label="Research Interests" type="textarea" rows={4} value={formData.researchInterests} onChange={(v) => setFormData({ ...formData, researchInterests: v })} />
              <AdminFormField label="Publications" type="textarea" rows={4} value={formData.publications} onChange={(v) => setFormData({ ...formData, publications: v })} />
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-200">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center shadow-md">
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : (editingId ? 'Update Faculty' : 'Save Faculty')}
              </button>
            </div>
          </form>

          {editingId && (
            <div className="mt-8 pt-8 border-t border-surface-200">
              <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Faculty Documents (CV, Publications)</h4>
              <DocumentUploadSection section="faculty" entityId={editingId} label="Faculty Documents" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyAdminPage;
