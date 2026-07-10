import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react';
import { apiClient } from '../../api/client';
import { motion } from 'framer-motion';

interface Menu {
  id: string;
  label: string;
  href: string;
  position: number;
  isVisible: boolean;
  parentId: string | null;
  children?: Menu[];
  parent?: { id: string, label: string };
}

const MenusAdminPage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Menu>>({});

  const fetchMenus = async () => {
    try {
      setLoading(true);
      // Using getAllMenus endpoint which includes all menus and their parents
      const res = await apiClient.get('/menus/all');
      setMenus(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch menus', error);
      alert('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleSave = async (id: string | null) => {
    try {
      if (id) {
        await apiClient.put(`/menus/${id}`, formData);
      } else {
        await apiClient.post('/menus', formData);
      }
      setEditingId(null);
      setFormData({});
      fetchMenus();
    } catch (error) {
      console.error('Failed to save menu', error);
      alert('Failed to save menu');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu? This will also delete all its children.')) {
      try {
        await apiClient.delete(`/menus/${id}`);
        fetchMenus();
      } catch (error) {
        console.error('Failed to delete menu', error);
        alert('Failed to delete menu');
      }
    }
  };

  const startEdit = (menu: Menu) => {
    setEditingId(menu.id);
    setFormData({
      label: menu.label,
      href: menu.href,
      position: menu.position,
      isVisible: menu.isVisible,
      parentId: menu.parentId
    });
  };

  const startCreate = () => {
    setEditingId('new');
    setFormData({
      label: '',
      href: '',
      position: 0,
      isVisible: true,
      parentId: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Menu Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={fetchMenus}
            className="flex items-center gap-2 px-4 py-2 bg-surface-200 text-text rounded-lg hover:bg-surface-300 transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button 
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition shadow-md"
          >
            <Plus size={18} />
            Add Menu
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading menus...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-200 text-sm text-text-secondary uppercase tracking-wider">
                <th className="p-4 font-semibold">Label</th>
                <th className="p-4 font-semibold">Link (Href)</th>
                <th className="p-4 font-semibold">Parent Menu</th>
                <th className="p-4 font-semibold w-24">Position</th>
                <th className="p-4 font-semibold w-24 text-center">Visible</th>
                <th className="p-4 font-semibold w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {editingId === 'new' && (
                <tr className="bg-primary-50/30">
                  <td className="p-3">
                    <input type="text" className="w-full border border-surface-300 rounded p-1.5" placeholder="Menu Label" value={formData.label || ''} onChange={(e) => setFormData({...formData, label: e.target.value})} />
                  </td>
                  <td className="p-3">
                    <input type="text" className="w-full border border-surface-300 rounded p-1.5" placeholder="/path or https://" value={formData.href || ''} onChange={(e) => setFormData({...formData, href: e.target.value})} />
                  </td>
                  <td className="p-3">
                    <select className="w-full border border-surface-300 rounded p-1.5 bg-white" value={formData.parentId || ''} onChange={(e) => setFormData({...formData, parentId: e.target.value || null})}>
                      <option value="">None (Top Level)</option>
                      {menus.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <input type="number" className="w-full border border-surface-300 rounded p-1.5" value={formData.position || 0} onChange={(e) => setFormData({...formData, position: parseInt(e.target.value)})} />
                  </td>
                  <td className="p-3 text-center">
                    <input type="checkbox" className="w-4 h-4 text-primary rounded" checked={formData.isVisible !== false} onChange={(e) => setFormData({...formData, isVisible: e.target.checked})} />
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => handleSave(null)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Save size={18} /></button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><X size={18} /></button>
                  </td>
                </tr>
              )}
              
              {menus.map((menu) => (
                editingId === menu.id ? (
                  <tr key={menu.id} className="bg-primary-50/30">
                    <td className="p-3">
                      <input type="text" className="w-full border border-surface-300 rounded p-1.5" value={formData.label || ''} onChange={(e) => setFormData({...formData, label: e.target.value})} />
                    </td>
                    <td className="p-3">
                      <input type="text" className="w-full border border-surface-300 rounded p-1.5" value={formData.href || ''} onChange={(e) => setFormData({...formData, href: e.target.value})} />
                    </td>
                    <td className="p-3">
                      <select className="w-full border border-surface-300 rounded p-1.5 bg-white" value={formData.parentId || ''} onChange={(e) => setFormData({...formData, parentId: e.target.value || null})}>
                        <option value="">None (Top Level)</option>
                        {menus.filter(m => m.id !== menu.id).map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <input type="number" className="w-full border border-surface-300 rounded p-1.5" value={formData.position || 0} onChange={(e) => setFormData({...formData, position: parseInt(e.target.value)})} />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" className="w-4 h-4 text-primary rounded" checked={formData.isVisible} onChange={(e) => setFormData({...formData, isVisible: e.target.checked})} />
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleSave(menu.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Save size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><X size={18} /></button>
                    </td>
                  </tr>
                ) : (
                  <tr key={menu.id} className="hover:bg-surface-50 transition">
                    <td className="p-4 font-medium text-text">
                      <div className="flex items-center gap-2">
                        {menu.parentId ? <div className="w-4 border-b border-l border-surface-300 h-4 rounded-bl-sm inline-block"></div> : null}
                        {menu.label}
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary text-sm font-mono truncate max-w-[200px]">{menu.href}</td>
                    <td className="p-4 text-text-secondary text-sm">
                      {menu.parent ? (
                        <span className="px-2 py-1 bg-surface-200 rounded-md text-xs">{menu.parent.label}</span>
                      ) : (
                        <span className="text-surface-400 italic">None</span>
                      )}
                    </td>
                    <td className="p-4 text-text-secondary">{menu.position}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${menu.isVisible ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => startEdit(menu)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(menu.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )
              ))}
              {menus.length === 0 && editingId !== 'new' && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">No menus found. Create your first menu.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MenusAdminPage;
