import { useEffect, useState } from "react";
import { preloadCriticalIcons, preloadIconsByCategory, getIconCacheStats } from "@/utils/iconPreloader";

interface IconPreloadState {
  isPreloading: boolean;
  preloadComplete: boolean;
  error: string | null;
  stats: {
    preloadedCount: number;
    loadingCount: number;
    preloadedIcons: string[];
  };
}

/**
 * Hook to manage icon preloading for better performance
 */
export const useIconPreloader = (enablePreloading: boolean = true) => {
  const [state, setState] = useState<IconPreloadState>({
    isPreloading: false,
    preloadComplete: false,
    error: null,
    stats: {
      preloadedCount: 0,
      loadingCount: 0,
      preloadedIcons: [],
    },
  });

  // Preload critical icons on mount
  useEffect(() => {
    if (!enablePreloading) return;

    let isMounted = true;

    const preloadIcons = async () => {
      setState(prev => ({ ...prev, isPreloading: true, error: null }));

      try {
        await preloadCriticalIcons();
        
        if (isMounted) {
          const stats = getIconCacheStats();
          setState(prev => ({
            ...prev,
            isPreloading: false,
            preloadComplete: true,
            stats,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            isPreloading: false,
            error: error instanceof Error ? error.message : 'Failed to preload icons',
          }));
        }
      }
    };

    preloadIcons();

    return () => {
      isMounted = false;
    };
  }, [enablePreloading]);

  // Update stats periodically
  useEffect(() => {
    if (!enablePreloading) return;

    const updateStats = () => {
      const stats = getIconCacheStats();
      setState(prev => ({ ...prev, stats }));
    };

    const interval = setInterval(updateStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [enablePreloading]);

  // Function to preload icons for a specific category
  const preloadCategory = async (category: string) => {
    try {
      await preloadIconsByCategory(category);
      const stats = getIconCacheStats();
      setState(prev => ({ ...prev, stats }));
    } catch (error) {
      console.warn(`Failed to preload category ${category}:`, error);
    }
  };

  return {
    ...state,
    preloadCategory,
  };
};
