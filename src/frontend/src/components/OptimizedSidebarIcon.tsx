import { memo, useMemo } from "react";
import { ForwardedIconComponent } from "@/components/common/genericIconComponent";
import { cn } from "@/utils/utils";

interface OptimizedSidebarIconProps {
  icon: string;
  className?: string;
  color?: string;
  size?: number;
  isVisible?: boolean;
}

/**
 * Optimized icon component for sidebar items
 * Uses intersection observer to only load visible icons
 */
const OptimizedSidebarIcon = memo(({
  icon,
  className,
  color,
  size = 20,
  isVisible = true,
}: OptimizedSidebarIconProps) => {
  // Memoize icon props to prevent unnecessary re-renders
  const iconProps = useMemo(() => ({
    name: icon,
    className: cn(
      "transition-colors duration-200",
      className
    ),
    style: {
      width: size,
      height: size,
      color: color,
    },
    // Skip fallback for better performance in sidebar
    skipFallback: !isVisible,
  }), [icon, className, color, size, isVisible]);

  // Don't render if not visible (for virtualization)
  if (!isVisible) {
    return (
      <div 
        className={cn("flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        <div className="w-4 h-4 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return <ForwardedIconComponent {...iconProps} />;
});

OptimizedSidebarIcon.displayName = 'OptimizedSidebarIcon';

export default OptimizedSidebarIcon;
