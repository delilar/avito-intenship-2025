import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const ImageUpload = ({ 
  initialImage, 
  onImageChange,
  maxWidth = 400,
  maxHeight = 200,
  quality = 0.8
}: ImageUploadProps) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          // Вычисляем новые размеры, сохраняя пропорции
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          // Создаем canvas для сжатия
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Рисуем изображение с новыми размерами
          ctx.drawImage(img, 0, 0, width, height);
          
          // Конвертируем в base64 с указанным качеством
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // Проверяем размер результата
          const approximateSize = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
          if (approximateSize > 1024 * 1024) { // Если больше 1MB
            reject(new Error('Image is too large after compression'));
            return;
          }
          
          resolve(dataUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        if (typeof readerEvent.target?.result === 'string') {
          img.src = readerEvent.target.result;
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, загрузите изображение');
        return;
      }

      try {
        const compressedImage = await compressImage(file);
        setImage(compressedImage);
        onImageChange(compressedImage);
      } catch (err) {
        setError('Ошибка при обработке изображения. Попробуйте другой файл.');
        console.error('Error processing image:', err);
      }
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(null);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, загрузите изображение');
        return;
      }

      try {
        const compressedImage = await compressImage(file);
        setImage(compressedImage);
        onImageChange(compressedImage);
      } catch (err) {
        setError('Ошибка при обработке изображения. Попробуйте другой файл.');
        console.error('Error processing image:', err);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveImage = () => {
    setImage(null);
    onImageChange(null);
    setError(null);
  };

  return (
    <Box className="w-full">
      <Box 
        className="relative w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {image ? (
          <>
            <img 
              src={image} 
              alt="Uploaded preview" 
              className="w-full h-full object-cover rounded-lg"
            />
            <IconButton 
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white hover:bg-gray-100"
              size="small"
            >
              <X className="w-5 h-5" />
            </IconButton>
          </>
        ) : (
          <>
            <Typography className="text-gray-500 mb-2 text-center px-4">
              {error || 'Нажмите для выбора фото'}
            </Typography>
            <Upload className="w-8 h-8 text-gray-400" />
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </Box>
    </Box>
  );
};

export default ImageUpload;