import { memo, useEffect, useState } from "react";
import { useIconPreloader } from "@/hooks/use-icon-preloader";

interface IconPerformanceMonitorProps {
  enabled?: boolean;
  showStats?: boolean;
}

/**
 * Development component to monitor icon loading performance
 * Only renders in development mode
 */
const IconPerformanceMonitor = memo(({ 
  enabled = process.env.NODE_ENV === 'development',
  showStats = false 
}: IconPerformanceMonitorProps) => {
  const { isPreloading, preloadComplete, stats, error } = useIconPreloader(enabled);
  const [loadTimes, setLoadTimes] = useState<Record<string, number>>({});

  // Track icon load times
  useEffect(() => {
    if (!enabled) return;

    const originalConsoleTime = console.time;
    const originalConsoleTimeEnd = console.timeEnd;

    // Override console.time to track icon loading
    console.time = (label?: string) => {
      if (label?.startsWith('icon-load-')) {
        setLoadTimes(prev => ({ ...prev, [label]: performance.now() }));
      }
      return originalConsoleTime(label);
    };

    console.timeEnd = (label?: string) => {
      if (label?.startsWith('icon-load-')) {
        const startTime = loadTimes[label];
        if (startTime) {
          const duration = performance.now() - startTime;
          console.log(`🎨 ${label}: ${duration.toFixed(2)}ms`);
        }
      }
      return originalConsoleTimeEnd(label);
    };

    return () => {
      console.time = originalConsoleTime;
      console.timeEnd = originalConsoleTimeEnd;
    };
  }, [enabled, loadTimes]);

  // Log performance metrics
  useEffect(() => {
    if (!enabled || !preloadComplete) return;

    console.group('🎨 Icon Performance Stats');
    console.log(`✅ Preloaded: ${stats.preloadedCount} icons`);
    console.log(`⏳ Loading: ${stats.loadingCount} icons`);
    console.log('📋 Preloaded icons:', stats.preloadedIcons);
    if (error) {
      console.error('❌ Preload error:', error);
    }
    console.groupEnd();
  }, [enabled, preloadComplete, stats, error]);

  // Don't render anything in production or if disabled
  if (!enabled || !showStats) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
      }}
    >
      <div>🎨 Icon Performance</div>
      <div>Status: {isPreloading ? '⏳ Loading...' : preloadComplete ? '✅ Complete' : '❌ Error'}</div>
      <div>Preloaded: {stats.preloadedCount}</div>
      <div>Loading: {stats.loadingCount}</div>
      {error && <div style={{ color: '#ff6b6b' }}>Error: {error}</div>}
    </div>
  );
});

IconPerformanceMonitor.displayName = 'IconPerformanceMonitor';

export default IconPerformanceMonitor;
