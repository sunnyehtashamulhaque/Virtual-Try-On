
import React, { useRef, useState } from 'react';
import { ImageState } from '../types';

interface ImageUploaderProps {
  id: string;
  onImageUpload: (imageState: ImageState) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  previewUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, onImageUpload, title, description, icon, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const parts = dataUrl.split(',');
        const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const base64 = parts[1];
        
        onImageUpload({
          base64,
          mimeType,
          previewUrl: dataUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="w-full max-w-lg p-6 bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:border-indigo-500 transition-colors duration-300 flex flex-col items-center justify-center text-center"
      onClick={handleAreaClick}
    >
      <input
        id={id}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="max-h-64 w-auto object-contain rounded-lg shadow-lg" />
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          <div className="w-16 h-16 text-gray-500 mb-4">{icon}</div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm">{description}</p>
          <span className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
            Browse File
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
