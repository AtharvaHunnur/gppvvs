import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Save } from 'lucide-react';

const SettingsAdminPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get('/settings');
      setSettings(res.data.data);
    } catch (error) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put('/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Global Settings</h1>
          <p className="text-text-secondary text-sm">Manage global institutional information, contact details, and social links.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md disabled:opacity-50"
        >
          <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* General Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 bg-surface-50">
            <h2 className="font-bold text-lg text-primary">General Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1">Institution Name</label>
              <input name="site_name" value={settings.site_name || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1">About Text (Footer)</label>
              <textarea name="site_description" rows={3} value={settings.site_description || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Establishment Year</label>
              <input name="establishment_year" value={settings.establishment_year || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Affiliation</label>
              <input name="affiliation" value={settings.affiliation || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 bg-surface-50">
            <h2 className="font-bold text-lg text-primary">Contact Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-1">Address</label>
              <textarea name="contact_address" rows={2} value={settings.contact_address || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Email</label>
              <input name="contact_email" value={settings.contact_email || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Phone</label>
              <input name="contact_phone" value={settings.contact_phone || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 bg-surface-50">
            <h2 className="font-bold text-lg text-primary">Social Links</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-1">Facebook URL</label>
              <input name="social_facebook" value={settings.social_facebook || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Twitter / X URL</label>
              <input name="social_twitter" value={settings.social_twitter || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Instagram URL</label>
              <input name="social_instagram" value={settings.social_instagram || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">LinkedIn URL</label>
              <input name="social_linkedin" value={settings.social_linkedin || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default SettingsAdminPage;
