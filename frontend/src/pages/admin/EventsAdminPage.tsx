import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const EventsAdminPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Default to tomorrow 10 AM
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 1);
  defaultDate.setHours(10, 0, 0, 0);

  const emptyForm = {
    title: '',
    description: '',
    date: defaultDate.toISOString().slice(0, 16),
    venue: '',
  };
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

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
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchEvents();
    } catch (error) {
      alert('Failed to save event.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await apiClient.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Manage Events</h1>
          <p className="text-text-secondary text-sm">Organize campus events, seminars, and important dates.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" /> Create Event
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50 text-text-secondary text-xs uppercase tracking-wider border-b border-surface-200">
              <th className="p-4 font-bold">Event Info</th>
              <th className="p-4 font-bold">Date & Time</th>
              <th className="p-4 font-bold">Location</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {events.map(evt => {
              const isPastEvent = new Date(evt.date) < new Date();
              return (
                <tr key={evt.id} className={`hover:bg-surface-50 transition-colors ${isPastEvent ? 'opacity-60' : ''}`}>
                  <td className="p-4">
                    <div className="font-bold text-text mb-1">{evt.title}</div>
                    <div className="text-xs text-text-secondary line-clamp-1">{evt.description}</div>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    <div className="flex items-center text-text">
                      <CalendarIcon size={14} className="mr-2 text-primary" />
                      {format(new Date(evt.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-text-secondary text-xs mt-1 ml-6">
                      {format(new Date(evt.date), 'hh:mm a')}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2" />
                      {evt.venue}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(evt)} className="text-text-secondary hover:text-primary p-2 transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(evt.id)} className="text-text-secondary hover:text-red-500 p-2 transition-colors ml-2"><Trash2 size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit Event' : 'Schedule Event'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Date & Time</label>
                <input type="datetime-local" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Location</label>
                <input required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg resize-none" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-secondary hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update Event' : 'Save Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAdminPage;
