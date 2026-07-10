import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { apiClient } from '../../api/client';
import { Image as ImageIcon, Camera, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryPage = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [albumImages, setAlbumImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await apiClient.get('/gallery/albums');
        setAlbums(res.data.data);
      } catch (error) {
        console.error('Failed to fetch albums', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const openAlbum = async (album: any) => {
    setSelectedAlbum(album);
    setLoadingImages(true);
    try {
      const res = await apiClient.get(`/gallery/albums/${album.id}`);
      setAlbumImages(res.data.data.images);
    } catch (error) {
      console.error('Failed to fetch album images', error);
    } finally {
      setLoadingImages(false);
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      <Helmet>
        <title>Photo Gallery | GPPVVS College</title>
      </Helmet>

      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20 border-b-[8px] border-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 drop-shadow-lg">
            Photo Gallery
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-secondary to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto font-medium">
            Memories, milestones, and campus life in pictures.
          </p>
        </div>
      </div>

      <div className="container-custom mt-12">
        
        {selectedAlbum ? (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedAlbum(null)}
              className="text-primary font-bold hover:text-secondary transition flex items-center mb-6"
            >
              ← Back to Albums
            </button>
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-heading text-text">{selectedAlbum.title}</h2>
              <p className="text-text-secondary mt-2">{selectedAlbum.description}</p>
            </div>

            {loadingImages ? (
              <div className="text-center py-20 text-text-secondary">Loading images...</div>
            ) : albumImages.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-surface-200">
                <Camera size={48} className="mx-auto text-surface-300 mb-4" />
                <p className="text-text-secondary">No images in this album yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {albumImages.map((img) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={img.id} 
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
                  >
                    <img src={img.url} alt={img.caption || 'Gallery Image'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {img.caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white text-sm font-medium">{img.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="text-center py-20 text-text-secondary">Loading albums...</div>
            ) : albums.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-surface-200">
                <Folder size={48} className="mx-auto text-surface-300 mb-4" />
                <h3 className="text-xl font-bold text-text mb-2">No albums found</h3>
                <p className="text-text-secondary">Photo albums will appear here once uploaded.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album) => {
                  const coverImage = album.coverImage || (album.images && album.images.length > 0 ? album.images[0].url : null);
                  return (
                    <motion.div 
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => openAlbum(album)}
                      className="bg-white rounded-3xl overflow-hidden border border-surface-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                    >
                      <div className="h-64 bg-surface-100 relative overflow-hidden">
                        {coverImage ? (
                          <img src={coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-surface-300">
                            <ImageIcon size={64} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold font-heading text-text group-hover:text-primary transition-colors mb-2">
                          {album.title}
                        </h3>
                        <p className="text-text-secondary text-sm line-clamp-2">
                          {album.description || 'No description available.'}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default GalleryPage;
