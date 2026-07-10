import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Trash2, Folder, Image as ImageIcon, Edit } from 'lucide-react';

const GalleryAdminPage = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [albumImages, setAlbumImages] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyAlbumForm = { title: '', description: '' };
  const [albumFormData, setAlbumFormData] = useState(emptyAlbumForm);
  const [imageFormData, setImageFormData] = useState({ url: '', caption: '' });

  const fetchAlbums = async () => {
    try {
      const res = await apiClient.get('/gallery/albums');
      setAlbums(res.data.data);
    } catch (error) {
      console.error('Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setAlbumFormData(emptyAlbumForm);
    setIsModalOpen(true);
  };

  const openEditModal = (album: any) => {
    setEditingId(album.id);
    setAlbumFormData({
      title: album.title || '',
      description: album.description || ''
    });
    setIsModalOpen(true);
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/gallery/albums/${editingId}`, albumFormData);
      } else {
        await apiClient.post('/gallery/albums', albumFormData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setAlbumFormData(emptyAlbumForm);
      fetchAlbums();
    } catch (error) {
      alert('Failed to save album');
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm('Delete this entire album and all its images?')) return;
    try {
      await apiClient.delete(`/gallery/albums/${id}`);
      if (selectedAlbum?.id === id) setSelectedAlbum(null);
      fetchAlbums();
    } catch (error) {
      alert('Failed to delete album');
    }
  };

  const openAlbumDetails = async (album: any) => {
    setSelectedAlbum(album);
    try {
      const res = await apiClient.get(`/gallery/albums/${album.id}`);
      setAlbumImages(res.data.data.images);
    } catch (error) {
      console.error('Failed to fetch album images');
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum) return;
    try {
      await apiClient.post(`/gallery/albums/${selectedAlbum.id}/images`, imageFormData);
      setImageFormData({ url: '', caption: '' });
      openAlbumDetails(selectedAlbum); // refresh images
    } catch (error) {
      alert('Failed to add image. Ensure URL is valid and less than 255 chars.');
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await apiClient.delete(`/gallery/images/${id}`);
      openAlbumDetails(selectedAlbum); // refresh images
    } catch (error) {
      alert('Failed to delete image');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      
      {!selectedAlbum ? (
        // ALBUMS LIST VIEW
        <>
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
            <div>
              <h1 className="text-2xl font-bold text-primary font-heading">Manage Gallery Albums</h1>
              <p className="text-text-secondary text-sm">Create and organize photo albums.</p>
            </div>
            <button 
              onClick={openAddModal}
              className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center shadow-md"
            >
              <Plus size={18} className="mr-2" /> New Album
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <div key={album.id} className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary-50 text-primary rounded-xl flex items-center justify-center">
                      <Folder size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-text leading-tight">{album.title}</h3>
                      <p className="text-xs text-text-secondary mt-1">{new Date(album.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-6 line-clamp-2">{album.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-surface-200">
                    <button onClick={() => openAlbumDetails(album)} className="text-primary font-bold hover:text-secondary text-sm">
                      Manage Images
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(album)} className="text-text-secondary hover:text-primary p-2 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteAlbum(album.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // SINGLE ALBUM MANAGE VIEW
        <>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
            <button onClick={() => setSelectedAlbum(null)} className="text-primary font-bold hover:text-secondary mb-4 flex items-center text-sm">
              ← Back to Albums
            </button>
            <h1 className="text-2xl font-bold text-text font-heading">{selectedAlbum.title}</h1>
            <p className="text-text-secondary text-sm mt-1">{selectedAlbum.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Image Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 sticky top-6">
                <h3 className="font-bold text-lg mb-4 flex items-center"><ImageIcon className="mr-2" size={20}/> Add New Image</h3>
                <form onSubmit={handleAddImage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Image URL *</label>
                    <input required value={imageFormData.url} onChange={e => setImageFormData({...imageFormData, url: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Caption (Optional)</label>
                    <input value={imageFormData.caption} onChange={e => setImageFormData({...imageFormData, caption: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Event photo..." />
                  </div>
                  <button type="submit" className="w-full bg-secondary text-primary-900 font-bold py-2 rounded-lg hover:bg-yellow-500 transition shadow-sm">
                    Upload Image
                  </button>
                </form>
              </div>
            </div>

            {/* Images Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                <h3 className="font-bold text-lg mb-4">Images in Album ({albumImages.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {albumImages.map(img => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-surface-200">
                      <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                        <div className="flex justify-end">
                          <button onClick={() => handleDeleteImage(img.id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {img.caption && <p className="text-white text-xs font-medium truncate">{img.caption}</p>}
                      </div>
                    </div>
                  ))}
                  {albumImages.length === 0 && (
                    <div className="col-span-full py-12 text-center text-text-secondary border-2 border-dashed rounded-xl">
                      No images added yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Album Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-text/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-primary">{editingId ? 'Edit Album' : 'Create Album'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreateAlbum} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Album Title *</label>
                <input required value={albumFormData.title} onChange={e => setAlbumFormData({...albumFormData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea rows={3} value={albumFormData.description} onChange={e => setAlbumFormData({...albumFormData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg resize-none" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-surface-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-700">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdminPage;
