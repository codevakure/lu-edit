/**
 * Avatar utility functions for generating initials-based avatars
 * and handling custom profile images
 */

/**
 * Generate initials from a username or full name
 */
export function generateInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return "U"; // Default to "U" for User
  }

  const cleanName = name.trim();
  const words = cleanName.split(/\s+/);
  
  if (words.length === 1) {
    // Single word - take first two characters
    return cleanName.substring(0, 2).toUpperCase();
  } else {
    // Multiple words - take first character of first two words
    return (words[0][0] + words[1][0]).toUpperCase();
  }
}

/**
 * Generate a consistent color based on the user's name
 */
export function generateAvatarColor(name: string): string {
  if (!name) return "#6366f1"; // Default indigo color
  
  // Generate a hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert hash to a hue value (0-360)
  const hue = Math.abs(hash) % 360;
  
  // Use HSL for consistent, pleasant colors
  // Keep saturation and lightness consistent for better readability
  return `hsl(${hue}, 65%, 55%)`;
}

/**
 * Generate avatar background gradient
 */
export function generateAvatarGradient(name: string): string {
  const baseColor = generateAvatarColor(name);
  const hue = parseInt(baseColor.match(/\d+/)?.[0] || "220");
  
  // Create a subtle gradient with the base color
  const color1 = `hsl(${hue}, 65%, 55%)`;
  const color2 = `hsl(${(hue + 30) % 360}, 65%, 65%)`;
  
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

/**
 * Compress image to base64 with size limit
 */
export function compressImageToBase64(
  file: File,
  maxSizeKB: number = 2,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions to maintain aspect ratio
      const maxDimension = 150; // Max width/height for avatar
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels to meet size requirement
      let currentQuality = quality;
      let base64 = '';
      
      const tryCompress = () => {
        base64 = canvas.toDataURL('image/jpeg', currentQuality);
        const sizeKB = (base64.length * 3) / 4 / 1024; // Approximate size in KB
        
        if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
          resolve(base64);
        } else {
          currentQuality -= 0.1;
          tryCompress();
        }
      };
      
      tryCompress();
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeMB = 5;
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a JPEG, PNG, or WebP image file.'
    };
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB.`
    };
  }
  
  return { valid: true };
}

/**
 * Generate SVG avatar with initials
 */
export function generateInitialsAvatar(
  name: string,
  size: number = 40
): string {
  const initials = generateInitials(name);
  const gradient = generateAvatarGradient(name);
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient-${name.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${generateAvatarColor(name)};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${generateAvatarColor(name + 'alt')};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#gradient-${name.replace(/\s+/g, '')})" />
      <text x="${size/2}" y="${size/2}" text-anchor="middle" dominant-baseline="central" 
            fill="white" font-family="system-ui, sans-serif" font-size="${size * 0.4}" font-weight="600">
        ${initials}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
