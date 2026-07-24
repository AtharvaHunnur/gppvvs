import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import AdminTable from '../../components/admin/AdminTable';
import AdminFormField from '../../components/admin/AdminFormField';
import DocumentUploadSection from '../../components/admin/DocumentUploadSection';

const EventsAdminPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 1);
  defaultDate.setHours(10, 0, 0, 0);

  const emptyForm = { title: '', description: '', date: defaultDate.toISOString().slice(0, 16), venue: '' };
  const [formData, setFormData] = useState(emptyForm);

  const fetchEvents = async () => {
    try {
      const res = await apiClient.get('/events?limit=100');
      setEvents(res.data.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openAddModal = () => { setEditingId(null); setFormData(emptyForm); setIsModalOpen(true); };

  const openEditModal = (evt: any) => {
    setEditingId(evt.id);
    setFormData({
      title: evt.title || '',
      description: evt.description || '',
      date: evt.date ? new Date(evt.date).toISOString().slice(0, 16) : defaultDate.toISOString().slice(0, 16),
      venue: evt.venue || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/events/${editingId}`, formData);
      } else {
        await apiClient.post('/events', formData);
      }
      setIsModalOpen(false); setEditingId(null); setFormData(emptyForm); fetchEvents();
    } catch (error) { alert('Failed to save event.'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    try { await apiClient.delete(`/events/${id}`); if (selectedEventId === id) setSelectedEventId(null); fetchEvents(); }
    catch (error) { console.error('Failed to delete event'); }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading events...</div>;

  const columns = [
    {
      key: 'title', label: 'Event Info',
      render: (row: any) => (
        <div>
          <div className="font-bold text-text mb-1">{row.title}</div>
          <div className="text-xs text-text-secondary line-clamp-1">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'date', label: 'Date & Time',
      render: (row: any) => (
        <div>
          <div className="flex items-center text-text text-sm font-medium">
            <CalendarIcon size={14} className="mr-2 text-primary" />
            {format(new Date(row.date), 'MMM dd, yyyy')}
          </div>
          <div className="text-text-secondary text-xs mt-1 ml-6">{format(new Date(row.date), 'hh:mm a')}</div>
        </div>
      ),
    },
    {
      key: 'venue', label: 'Location',
      render: (row: any) => (
        <div className="flex items-center text-sm text-text-secondary">
          <MapPin size={14} className="mr-2" /> {row.venue}
        </div>
      ),
    },
    {
      key: 'actions', label: 'Actions', align: 'right' as const,
      render: (row: any) => (
          <button onClick={() => openEditModal(row)} className="text-text-secondary hover:text-primary p-2 transition-colors"><Edit size={18} /></button>
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-red-500 p-2 transition-colors"><Trash2 size={18} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Manage Events" description="Organize campus events, seminars, and important dates." actionLabel="Create Event" actionIcon={Plus} onAction={openAddModal} />
      <AdminTable columns={columns} data={events} emptyMessage="No events found." />

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Event' : 'Schedule Event'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminFormField label="Title" required value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} />
          <AdminFormField label="Date & Time" required type="datetime-local" value={formData.date} onChange={(v) => setFormData({ ...formData, date: v })} />
          <AdminFormField label="Location" required value={formData.venue} onChange={(v) => setFormData({ ...formData, venue: v })} />
          <AdminFormField label="Description" type="textarea" rows={3} value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} />
          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary hover:bg-surface-100 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700 transition">{editingId ? 'Update Event' : 'Save Event'}</button>
          </div>
        </form>

        <div className="pt-6 mt-6 border-t border-surface-200">
          <h4 className="font-bold text-sm text-text-secondary uppercase tracking-wider mb-4">Documents</h4>
          <DocumentUploadSection section="events" entityId={editingId} label="Event Documents" />
        </div>
      </AdminModal>
    </div>
  );
};

export default EventsAdminPage;
