import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { format } from 'date-fns';
import { Plus, Trash2, Calendar as CalendarIcon, Save, Loader2, Edit2 } from 'lucide-react';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const EventsAdminPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 1);
  defaultDate.setHours(10, 0, 0, 0);

  const emptyForm = { title: '', description: '', date: defaultDate.toISOString().slice(0, 16), venue: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await apiClient.get('/events?limit=100');
      setEvents(res.data.data);
      if (!editingId && res.data.data.length > 0) {
        handleSelect(res.data.data[0]);
      } else if (!editingId) {
        handleAddNew();
      }
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const showMsg = (type: string, text: string) => { 
    setMessage({ type, text }); 
    setTimeout(() => setMessage({ type: '', text: '' }), 5000); 
  };

  const handleSelect = (evt: any) => {
    setEditingId(evt.id);
    setFormData({
      title: evt.title || '',
      description: evt.description || '',
      date: evt.date ? new Date(evt.date).toISOString().slice(0, 16) : defaultDate.toISOString().slice(0, 16),
      venue: evt.venue || '',
    });
    setMessage({ type: '', text: '' });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/events/${editingId}`, formData);
        showMsg('success', 'Event updated successfully!');
      } else {
        const res = await apiClient.post('/events', formData);
        setEditingId(res.data.data.id);
        showMsg('success', 'Event created successfully!');
      }
      fetchEvents();
    } catch (error: any) { 
      showMsg('error', error.response?.data?.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this event?')) return;
    try { 
      await apiClient.delete(`/events/${id}`); 
      if (editingId === id) {
        handleAddNew();
      }
      fetchEvents(); 
      showMsg('success', 'Event deleted.');
    }
    catch (error) { 
      showMsg('error', 'Failed to delete event.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text flex items-center">
          <CalendarIcon className="mr-3 text-primary" size={28} /> Manage Events
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-surface-50 border-r border-surface-200 p-4 flex flex-col max-h-[800px]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-sm text-text-secondary uppercase tracking-wider">Events</h3>
            <button onClick={handleAddNew} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md transition-colors" title="Add New">
              <Plus size={18} />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {loading ? (
              <div className="text-center py-4 text-text-secondary text-sm">Loading...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-4 text-text-secondary text-sm">No events found.</div>
            ) : (
              events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleSelect(evt)}
                  className={`w-full flex items-center justify-between px-3 py-3 text-sm font-bold rounded-xl transition-colors cursor-pointer group ${
                    editingId === evt.id 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-text hover:bg-surface-200 border border-surface-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    {evt.title}
                    <div className={`text-xs font-normal truncate ${editingId === evt.id ? 'text-primary-100' : 'text-text-secondary'}`}>
                      {format(new Date(evt.date), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(evt.id, e)}
                    className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                      editingId === evt.id ? 'text-white hover:bg-white/20' : 'text-red-400 hover:bg-red-50 hover:text-red-600'
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
            {editingId ? `Editing: ${formData.title}` : 'Schedule New Event'}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <AdminFormField label="Title" required value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AdminFormField label="Date & Time" required type="datetime-local" value={formData.date} onChange={(v) => setFormData({ ...formData, date: v })} />
              <AdminFormField label="Location" required value={formData.venue} onChange={(v) => setFormData({ ...formData, venue: v })} />
            </div>
            <AdminFormField label="Description" type="textarea" rows={6} value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} />
            
            <div className="flex justify-end pt-4 border-t border-surface-200">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition flex items-center shadow-md">
                <Save size={18} className="mr-2" /> {saving ? 'Saving...' : (editingId ? 'Update Event' : 'Save Event')}
              </button>
            </div>
          </form>

          {editingId && (
            <div className="mt-8 pt-8 border-t border-surface-200">
              <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Event Documents (Schedule, Forms)</h4>
              <DocumentUploadSection section="events" entityId={editingId} label="Event Documents" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsAdminPage;
