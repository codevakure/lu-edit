import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

interface PerformanceMetrics {
  renderTime: number;
  nodeCount: number;
  edgeCount: number;
  fps: number;
  memoryUsage?: number;
}

/**
 * Hook to monitor ReactFlow performance metrics
 * Helps identify performance bottlenecks in real-time
 */
export const usePerformanceMonitor = (enabled: boolean = false) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    nodeCount: 0,
    edgeCount: 0,
    fps: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderStartRef = useRef(0);

  // Debounced metrics update to prevent excessive state updates
  const updateMetrics = useRef(
    debounce((newMetrics: Partial<PerformanceMetrics>) => {
      setMetrics(prev => ({ ...prev, ...newMetrics }));
    }, 100)
  ).current;

  // FPS monitoring
  useEffect(() => {
    if (!enabled) return;

    let animationId: number;

    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        updateMetrics({ fps });
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled, updateMetrics]);

  // Memory usage monitoring (if available)
  useEffect(() => {
    if (!enabled || !(performance as any).memory) return;

    const measureMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        updateMetrics({
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
        });
      }
    };

    const interval = setInterval(measureMemory, 2000);
    return () => clearInterval(interval);
  }, [enabled, updateMetrics]);

  // Render time measurement utilities
  const startRenderMeasurement = () => {
    if (enabled) {
      renderStartRef.current = performance.now();
    }
  };

  const endRenderMeasurement = (nodeCount: number, edgeCount: number) => {
    if (enabled && renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      updateMetrics({ renderTime, nodeCount, edgeCount });
      renderStartRef.current = 0;
    }
  };

  // Performance warnings
  const getPerformanceWarnings = () => {
    const warnings: string[] = [];
    
    if (metrics.fps < 30) {
      warnings.push(`Low FPS: ${metrics.fps} (target: 60+)`);
    }
    
    if (metrics.renderTime > 16) {
      warnings.push(`Slow render: ${metrics.renderTime.toFixed(2)}ms (target: <16ms)`);
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 100) {
      warnings.push(`High memory usage: ${metrics.memoryUsage}MB`);
    }
    
    if (metrics.nodeCount > 100) {
      warnings.push(`Large node count: ${metrics.nodeCount} (consider virtualization)`);
    }

    return warnings;
  };

  return {
    metrics,
    startRenderMeasurement,
    endRenderMeasurement,
    getPerformanceWarnings,
  };
};
