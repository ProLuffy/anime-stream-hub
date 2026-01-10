import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onAvatarChange: (avatarDataUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  username,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Read and compress image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          onAvatarChange(compressedDataUrl);
          toast.success('Profile picture updated!');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    onAvatarChange('');
    toast.success('Profile picture removed');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="w-24 h-24 border-4 border-primary/20">
          <AvatarImage src={currentAvatar} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {username[0]?.toUpperCase() || 'G'}
          </AvatarFallback>
        </Avatar>
        
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 rounded-full bg-black/60 flex items-center justify-center transition-opacity ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Photo
        </Button>
        
        {currentAvatar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveAvatar}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG or GIF. Max 5MB.
      </p>
    </div>
  );
};

export default AvatarUpload;
