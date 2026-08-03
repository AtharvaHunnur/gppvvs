import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Trash2, Building2, Save, Loader2, Edit2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const DepartmentsAdminPage = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const emptyForm = { name: '', slug: '', description: '', program: 'BA', hodName: '', hodPhoto: '', image: '', isPublished: true, position: 0 };
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try { 
      const res = await apiClient.get('/departments'); 
      setDepartments(res.data.data); 
      if (!editingId && res.data.data.length > 0) {
        handleSelect(res.data.data[0]);
      } else if (!editingId) {
        handleAddNew();
      }
    }
    catch (error) { console.error('Failed to fetch departments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const showMsg = (type: string, text: string) => { 
    setMessage({ type, text }); 
    setTimeout(() => setMessage({ type: '', text: '' }), 5000); 
  };

  const handleSelect = (dept: any) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name || '', slug: dept.slug || '', description: dept.description || '',
      program: dept.program || 'BA', hodName: dept.hodName || '', hodPhoto: dept.hodPhoto || '',
      image: dept.image || '', isPublished: dept.isPublished !== undefined ? dept.isPublished : true, position: dept.position || 0,
    });
    setMessage({ type: '', text: '' });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage({ type: '', text: '' });
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) { 
        await apiClient.put(`/departments/${editingId}`, { ...formData, position: Number(formData.position) }); 
        showMsg('success', 'Department updated successfully!');
      } else { 
        const res = await apiClient.post('/departments', { ...formData, position: Number(formData.position) }); 
        setEditingId(res.data.data.id);
        showMsg('success', 'Department created successfully!');
      }
      fetchDepartments();
    } catch (error: any) { 
      showMsg('error', error.response?.data?.message || 'Failed to save department. Check that the slug is unique.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this department? This will also delete all associated faculty and courses!')) return;
    try { 
      await apiClient.delete(`/departments/${id}`); 
      if (editingId === id) {
        handleAddNew();
      }
      fetchDepartments(); 
      showMsg('success', 'Department deleted.');
    }
    catch (error) { 
      showMsg('error', 'Failed to delete department.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text flex items-center">
          <Building2 className="mr-3 text-primary" size={28} /> Manage Departments
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-surface-50 border-r border-surface-200 p-4 flex flex-col max-h-[800px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Departments</h3>
            <button onClick={handleAddNew} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md transition-colors" title="Add New">
              <Plus size={18} />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 space-y-1 pr-1">
            {loading ? (
              <div className="text-center py-4 text-text-secondary text-sm">Loading...</div>
            ) : departments.length === 0 ? (
              <div className="text-center py-4 text-text-secondary text-sm">No departments found.</div>
            ) : (
              (() => {
                const streamLabels: Record<string, string> = { BA: 'B.A. Stream', BCOM: 'B.Com Stream', BSC: 'B.Sc. Stream' };
                const grouped: Record<string, any[]> = {};
                departments.forEach((dept) => {
                  const key = dept.program || 'OTHER';
                  if (!grouped[key]) grouped[key] = [];
                  grouped[key].push(dept);
                });
                const streamOrder = ['BA', 'BCOM', 'BSC'];
                const sortedKeys = Object.keys(grouped).sort((a, b) => {
                  const ai = streamOrder.indexOf(a);
                  const bi = streamOrder.indexOf(b);
                  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                });

                return sortedKeys.map((stream) => (
                  <div key={stream} className="mb-3">
                    <div className="px-2 py-2 text-[11px] font-extrabold text-text-secondary uppercase tracking-widest border-b border-surface-200 mb-1">
                      {streamLabels[stream] || stream}
                    </div>
                    <div className="space-y-1">
                      {grouped[stream].map((dept) => (
                        <div
                          key={dept.id}
                          onClick={() => handleSelect(dept)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold rounded-xl transition-colors cursor-pointer group ${
                            editingId === dept.id
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-white text-text hover:bg-surface-200 border border-surface-200'
                          }`}
                        >
                          <div className="truncate pr-2">
                            {dept.name}
                          </div>
                          <button
                            onClick={(e) => handleDelete(dept.id, e)}
                            className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${
                              editingId === dept.id ? 'text-white hover:bg-white/20' : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                            }`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()
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
            {editingId ? `Editing: ${formData.name}` : 'Create New Department'}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField label="Name" required value={formData.name} onChange={(v) => handleNameChange(v)} placeholder="e.g. Computer Science" />
              <AdminFormField label="URL Slug" value={formData.slug} onChange={(v) => setFormData({ ...formData, slug: v })} disabled />
              <AdminFormField label="Program" required type="select" value={formData.program} onChange={(v) => setFormData({ ...formData, program: v })} options={[{ value: 'BA', label: 'B.A.' }, { value: 'BCOM', label: 'B.Com' }, { value: 'BSC', label: 'B.Sc.' }]} />
              <AdminFormField label="Position (Order)" type="number" value={formData.position.toString()} onChange={(v) => setFormData({ ...formData, position: Number(v) })} />
              <AdminFormField label="HOD Name" value={formData.hodName} onChange={(v) => setFormData({ ...formData, hodName: v })} />
              <AdminFormField label="HOD Photo URL" value={formData.hodPhoto} onChange={(v) => setFormData({ ...formData, hodPhoto: v })} placeholder="/images/hod.jpg" />
              <AdminFormField label="Is Published" type="checkbox" value={formData.isPublished} onChange={(v) => setFormData({ ...formData, isPublished: v })} className="col-span-1 md:col-span-2" />
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-2">Description</label>
              <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
                <ReactQuill
                  theme="snow" value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} className="h-64 mb-12"
                  modules={{ toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], ['link', 'image', 'video'], ['clean']] }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-surface-200">
              <AdminFormField label="Department Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} placeholder="/images/dept.jpg" />
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-200">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center shadow-md">
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : (editingId ? 'Update Department' : 'Save Department')}
              </button>
            </div>
          </form>

          {editingId && (
            <div className="mt-8 pt-8 border-t border-surface-200">
              <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Department Documents (Syllabus, etc.)</h4>
              <DocumentUploadSection section="departments" entityId={editingId} label="Department Documents" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsAdminPage;

