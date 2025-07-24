import { useCallback, useMemo, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import type { AllNodeType, EdgeType } from "@/types/flow";

interface ViewportBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * Aggressive canvas virtualization for better performance
 * Only renders nodes and edges that are actually visible
 */
export const useCanvasVirtualization = (
  nodes: AllNodeType[],
  edges: EdgeType[],
  enabled: boolean = true
) => {
  const { getViewport } = useReactFlow();
  const lastViewportRef = useRef<{ x: number; y: number; zoom: number } | null>(null);
  const cachedVisibleNodesRef = useRef<AllNodeType[]>([]);
  const cachedVisibleEdgesRef = useRef<EdgeType[]>([]);

  // Calculate viewport bounds with buffer
  const getViewportBounds = useCallback((viewport: { x: number; y: number; zoom: number }): ViewportBounds => {
    const buffer = 300; // Increased buffer for smoother scrolling
    const viewportWidth = window.innerWidth / viewport.zoom;
    const viewportHeight = window.innerHeight / viewport.zoom;
    
    return {
      left: -viewport.x / viewport.zoom - buffer,
      right: (-viewport.x + viewportWidth) / viewport.zoom + buffer,
      top: -viewport.y / viewport.zoom - buffer,
      bottom: (-viewport.y + viewportHeight) / viewport.zoom + buffer,
    };
  }, []);

  // Check if viewport has changed significantly
  const hasViewportChanged = useCallback((currentViewport: { x: number; y: number; zoom: number }) => {
    if (!lastViewportRef.current) return true;
    
    const last = lastViewportRef.current;
    const threshold = 50; // Pixels
    const zoomThreshold = 0.1;
    
    return (
      Math.abs(currentViewport.x - last.x) > threshold ||
      Math.abs(currentViewport.y - last.y) > threshold ||
      Math.abs(currentViewport.zoom - last.zoom) > zoomThreshold
    );
  }, []);

  // Get visible nodes with aggressive culling
  const visibleNodes = useMemo(() => {
    if (!enabled) return nodes;

    try {
      const viewport = getViewport();
      
      // Use cached result if viewport hasn't changed much
      if (!hasViewportChanged(viewport) && cachedVisibleNodesRef.current.length > 0) {
        return cachedVisibleNodesRef.current;
      }

      const bounds = getViewportBounds(viewport);
      
      const visible = nodes.filter((node) => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        const nodeWidth = node.measured?.width || node.width || 200;
        const nodeHeight = node.measured?.height || node.height || 100;

        // Check if node intersects with viewport
        const intersects = (
          nodeX < bounds.right &&
          nodeX + nodeWidth > bounds.left &&
          nodeY < bounds.bottom &&
          nodeY + nodeHeight > bounds.top
        );

        return intersects;
      });

      // Always include selected nodes even if out of viewport
      const selectedNodes = nodes.filter(node => node.selected && !visible.includes(node));
      const result = [...visible, ...selectedNodes];

      // Cache the result
      cachedVisibleNodesRef.current = result;
      lastViewportRef.current = viewport;

      return result;
    } catch (error) {
      console.warn('Virtualization error, falling back to all nodes:', error);
      return nodes;
    }
  }, [nodes, enabled, getViewport, getViewportBounds, hasViewportChanged]);

  // Get visible edges (only edges connected to visible nodes)
  const visibleEdges = useMemo(() => {
    if (!enabled) return edges;

    try {
      const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
      
      const visible = edges.filter((edge) => {
        return visibleNodeIds.has(edge.source) || visibleNodeIds.has(edge.target);
      });

      cachedVisibleEdgesRef.current = visible;
      return visible;
    } catch (error) {
      console.warn('Edge virtualization error, falling back to all edges:', error);
      return edges;
    }
  }, [edges, visibleNodes, enabled]);

  // Performance stats
  const stats = useMemo(() => ({
    totalNodes: nodes.length,
    visibleNodes: visibleNodes.length,
    totalEdges: edges.length,
    visibleEdges: visibleEdges.length,
    culledNodes: nodes.length - visibleNodes.length,
    culledEdges: edges.length - visibleEdges.length,
    cullingRatio: nodes.length > 0 ? ((nodes.length - visibleNodes.length) / nodes.length * 100).toFixed(1) : '0',
  }), [nodes.length, visibleNodes.length, edges.length, visibleEdges.length]);

  return {
    visibleNodes,
    visibleEdges,
    stats,
  };
};
