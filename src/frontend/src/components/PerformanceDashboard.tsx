import { memo, useEffect, useState } from "react";
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor";
import { useIconPreloader } from "@/hooks/use-icon-preloader";

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  nodeCount: number;
  edgeCount: number;
  memoryUsage?: number;
  iconStats: {
    preloadedCount: number;
    loadingCount: number;
  };
  virtualizationStats?: {
    totalNodes: number;
    visibleNodes: number;
    cullingRatio: string;
  };
}

interface PerformanceDashboardProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  virtualizationStats?: any;
}

/**
 * Development performance dashboard showing real-time metrics
 */
const PerformanceDashboard = memo(({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  virtualizationStats 
}: PerformanceDashboardProps) => {
  const { metrics, startRenderMeasurement, endRenderMeasurement, getPerformanceWarnings } = usePerformanceMonitor(enabled);
  const { stats: iconStats } = useIconPreloader(enabled);
  const [isExpanded, setIsExpanded] = useState(false);

  // Combine all metrics
  const allMetrics: PerformanceMetrics = {
    ...metrics,
    iconStats: {
      preloadedCount: iconStats.preloadedCount,
      loadingCount: iconStats.loadingCount,
    },
    virtualizationStats,
  };

  const warnings = getPerformanceWarnings();

  // Position styles
  const positionStyles = {
    'top-left': { top: 10, left: 10 },
    'top-right': { top: 10, right: 10 },
    'bottom-left': { bottom: 10, left: 10 },
    'bottom-right': { bottom: 10, right: 10 },
  };

  if (!enabled) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        ...positionStyles[position],
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: isExpanded ? '12px' : '8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontFamily: 'monospace',
        zIndex: 10000,
        minWidth: isExpanded ? '280px' : '120px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>⚡ Performance</span>
        <span style={{ fontSize: '10px', opacity: 0.7 }}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '8px', lineHeight: '1.4' }}>
          {/* FPS */}
          <div style={{ 
            color: allMetrics.fps < 30 ? '#ff6b6b' : allMetrics.fps < 50 ? '#ffd93d' : '#51cf66' 
          }}>
            FPS: {allMetrics.fps}
          </div>

          {/* Render Time */}
          <div style={{ 
            color: allMetrics.renderTime > 16 ? '#ff6b6b' : '#51cf66' 
          }}>
            Render: {allMetrics.renderTime.toFixed(1)}ms
          </div>

          {/* Node/Edge Count */}
          <div>
            Nodes: {allMetrics.nodeCount} | Edges: {allMetrics.edgeCount}
          </div>

          {/* Virtualization Stats */}
          {virtualizationStats && (
            <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
              Visible: {virtualizationStats.visibleNodes}/{virtualizationStats.totalNodes} 
              ({virtualizationStats.cullingRatio}% culled)
            </div>
          )}

          {/* Icon Stats */}
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            Icons: {allMetrics.iconStats.preloadedCount} preloaded, {allMetrics.iconStats.loadingCount} loading
          </div>

          {/* Memory Usage */}
          {allMetrics.memoryUsage && (
            <div style={{ 
              color: allMetrics.memoryUsage > 100 ? '#ff6b6b' : '#51cf66',
              fontSize: '10px'
            }}>
              Memory: {allMetrics.memoryUsage}MB
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div style={{ 
              marginTop: '6px', 
              padding: '4px', 
              background: 'rgba(255,107,107,0.2)',
              borderRadius: '3px',
              fontSize: '10px'
            }}>
              ⚠️ {warnings.length} warning(s)
              {warnings.slice(0, 2).map((warning, i) => (
                <div key={i} style={{ opacity: 0.9 }}>
                  • {warning}
                </div>
              ))}
            </div>
          )}

          <div style={{ 
            marginTop: '6px', 
            fontSize: '9px', 
            opacity: 0.6 
          }}>
            Click to toggle • Dev only
          </div>
        </div>
      )}
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

export default PerformanceDashboard;
