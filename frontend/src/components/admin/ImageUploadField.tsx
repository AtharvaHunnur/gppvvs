import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/client';
import { getImageUrl } from '../../utils/url';

interface ImageUploadFieldProps {
  label?: string;
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  required?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Upload Image',
  value,
  onChange,
  multiple = false,
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value : (value ? [value] : []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      if (multiple) {
        // Upload multiple files
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        
        const res = await apiClient.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const newUrls = res.data.data.map((f: any) => f.url);
        onChange([...images, ...newUrls]);
      } else {
        // Upload single file
        const formData = new FormData();
        formData.append('file', files[0]);
        
        const res = await apiClient.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        onChange(res.data.data.url);
      }
    } catch (error) {
      console.error('Failed to upload image(s)', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    if (multiple) {
      onChange(images.filter((_, i) => i !== indexToRemove));
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-bold text-text mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 max-w-sm'}`}>
          {images.map((img, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-surface-200 aspect-video bg-surface-50 flex items-center justify-center">
              <img src={getImageUrl(img)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {(!value || (multiple) || (Array.isArray(value) && value.length === 0)) && (
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-surface-300 rounded-xl p-6 text-center cursor-pointer transition-colors ${uploading ? 'bg-surface-50 opacity-70 cursor-not-allowed' : 'hover:bg-primary-50 hover:border-primary/50'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
          />
          {uploading ? (
            <div className="flex flex-col items-center justify-center text-primary">
              <Loader2 size={28} className="animate-spin mb-2" />
              <span className="text-sm font-bold">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-text-secondary">
              <Upload size={28} className="mb-2 opacity-50" />
              <span className="text-sm font-medium">
                Click to upload {multiple ? 'images' : 'an image'}
              </span>
              <span className="text-xs mt-1 opacity-70">Supports JPG, PNG, WEBP</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
