import React, { useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onChange, 
  maxImages = 5 
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    try {
      const newImageUrls = [];
      
      for (const file of files) {
        if (images.length + newImageUrls.length >= maxImages) {
          break;
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        newImageUrls.push(publicUrl);
      }

      onChange([...images, ...newImageUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
        <label className="cursor-pointer block p-6">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading || images.length >= maxImages}
          />
          <div className="text-center">
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Click to upload images or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB ({images.length}/{maxImages} images)
                </p>
              </>
            )}
          </div>
        </label>
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square bg-muted">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;