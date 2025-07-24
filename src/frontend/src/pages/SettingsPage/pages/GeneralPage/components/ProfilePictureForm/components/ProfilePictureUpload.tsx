import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Avatar from "@/components/ui/avatar";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { cn } from "@/utils/utils";
import { 
  compressImageToBase64, 
  validateImageFile 
} from "@/utils/avatarUtils";

interface ProfilePictureUploadProps {
  userName: string;
  currentImage?: string | null;
  onImageChange: (base64Image: string | null) => void;
  className?: string;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  userName,
  currentImage,
  onImageChange,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      // Compress and convert to base64
      const base64 = await compressImageToBase64(file, 2, 0.8);
      onImageChange(base64);
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("Image processing error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        <Avatar
          name={userName}
          src={currentImage}
          size={80}
          className="ring-2 ring-muted"
        />
        <div className="flex-1">
          <h3 className="font-medium text-sm">Profile Picture</h3>
          <p className="text-xs text-muted-foreground">
            Upload a custom image or use the default avatar with your initials
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          isUploading && "opacity-50 pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-2">
          <ForwardedIconComponent
            name="Upload"
            className="mx-auto h-8 w-8 text-muted-foreground"
          />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isUploading ? "Processing image..." : "Drop an image here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or{" "}
              <button
                type="button"
                onClick={handleUploadClick}
                className="text-primary hover:underline"
                disabled={isUploading}
              >
                browse files
              </button>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, or WebP • Max 5MB • Will be compressed to &lt;2KB
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex-1"
        >
          <ForwardedIconComponent name="Upload" className="w-4 h-4 mr-2" />
          {isUploading ? "Processing..." : "Upload Image"}
        </Button>
        
        {currentImage && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <ForwardedIconComponent name="Trash2" className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}

      {/* Info Message */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
        <strong>Note:</strong> Images are compressed and stored as base64 data (&lt;2KB) for optimal performance. 
        If no custom image is uploaded, your avatar will display your initials with a unique color.
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
