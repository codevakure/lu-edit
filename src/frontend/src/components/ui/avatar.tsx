import React from "react";
import { cn } from "@/utils/utils";
import { generateInitials, generateAvatarGradient } from "@/utils/avatarUtils";

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 40,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  const initials = generateInitials(name);
  const gradient = generateAvatarGradient(name);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };
  
  const showImage = src && !imageError && imageLoaded;
  
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden select-none",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      style={{
        width: size,
        height: size,
        background: showImage ? 'transparent' : gradient,
      }}
      onClick={onClick}
    >
      {src && !imageError && (
        <img
          src={src}
          alt={`${name}'s avatar`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {(!src || imageError || !imageLoaded) && (
        <span
          className="text-white font-semibold select-none"
          style={{
            fontSize: size * 0.4,
            lineHeight: 1,
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};

export default Avatar;
