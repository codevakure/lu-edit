import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/utils/utils";
import { generateInitials, generateAvatarGradient } from "@/utils/avatarUtils";

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarProps
>(({ name, src, size = 40, className, onClick, ...props }, ref) => {
  const initials = generateInitials(name);
  const gradient = generateAvatarGradient(name);

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full select-none",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      style={{
        width: size,
        height: size,
      }}
      onClick={onClick}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src || undefined}
        alt={`${name}'s avatar`}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center text-white font-semibold"
        style={{
          background: gradient,
          fontSize: size * 0.4,
        }}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});

Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
export default Avatar;
