import { useCallback, useMemo, useRef } from "react";
import { debounce } from "lodash";
import type { NodeChange, EdgeChange, Connection, OnNodesChange, OnEdgesChange } from "@xyflow/react";
import type { AllNodeType, EdgeType } from "@/types/flow";

/**
 * Performance optimization hook for ReactFlow
 * Implements debouncing, memoization, and batch updates
 */
export const useReactFlowPerformance = () => {
  const lastUpdateRef = useRef<number>(0);
  const batchedChangesRef = useRef<NodeChange[]>([]);
  const batchedEdgeChangesRef = useRef<EdgeChange[]>([]);

  // Debounced node changes to prevent excessive re-renders
  const debouncedNodeChanges = useMemo(
    () =>
      debounce((changes: NodeChange[], applyChanges: (changes: NodeChange[]) => void) => {
        applyChanges(changes);
        batchedChangesRef.current = [];
      }, 16), // ~60fps
    []
  );

  // Debounced edge changes
  const debouncedEdgeChanges = useMemo(
    () =>
      debounce((changes: EdgeChange[], applyChanges: (changes: EdgeChange[]) => void) => {
        applyChanges(changes);
        batchedEdgeChangesRef.current = [];
      }, 16),
    []
  );

  // Optimized node change handler with batching
  const handleNodesChange = useCallback(
    <T extends AllNodeType>(changes: NodeChange<T>[], applyChanges: OnNodesChange<T>) => {
      const now = Date.now();
      
      // Batch changes if they come in quick succession
      if (now - lastUpdateRef.current < 16) {
        batchedChangesRef.current.push(...(changes as NodeChange[]));
        debouncedNodeChanges(batchedChangesRef.current, applyChanges as (changes: NodeChange[]) => void);
      } else {
        applyChanges(changes);
      }
      
      lastUpdateRef.current = now;
    },
    [debouncedNodeChanges]
  );

  // Optimized edge change handler with batching
  const handleEdgesChange = useCallback(
    <T extends EdgeType>(changes: EdgeChange<T>[], applyChanges: OnEdgesChange<T>) => {
      const now = Date.now();
      
      if (now - lastUpdateRef.current < 16) {
        batchedEdgeChangesRef.current.push(...(changes as EdgeChange[]));
        debouncedEdgeChanges(batchedEdgeChangesRef.current, applyChanges as (changes: EdgeChange[]) => void);
      } else {
        applyChanges(changes);
      }
      
      lastUpdateRef.current = now;
    },
    [debouncedEdgeChanges]
  );

  // Memoized connection validation
  const isValidConnection = useCallback((connection: Connection) => {
    // Add your connection validation logic here
    // This should be memoized to prevent recalculation
    return connection.source !== connection.target;
  }, []);

  // Virtualization helper for large node counts
  const getVisibleNodes = useCallback(
    (nodes: AllNodeType[], viewport: { x: number; y: number; zoom: number }) => {
      // Simple viewport-based filtering for virtualization
      // Only render nodes that are likely to be visible
      const buffer = 200; // Buffer around viewport
      const viewportWidth = window.innerWidth / viewport.zoom;
      const viewportHeight = window.innerHeight / viewport.zoom;
      
      const visibleBounds = {
        left: -viewport.x / viewport.zoom - buffer,
        right: (-viewport.x + viewportWidth) / viewport.zoom + buffer,
        top: -viewport.y / viewport.zoom - buffer,
        bottom: (-viewport.y + viewportHeight) / viewport.zoom + buffer,
      };

      return nodes.filter((node) => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        const nodeWidth = node.measured?.width || 200;
        const nodeHeight = node.measured?.height || 100;

        return (
          nodeX + nodeWidth >= visibleBounds.left &&
          nodeX <= visibleBounds.right &&
          nodeY + nodeHeight >= visibleBounds.top &&
          nodeY <= visibleBounds.bottom
        );
      });
    },
    []
  );

  return {
    handleNodesChange,
    handleEdgesChange,
    isValidConnection,
    getVisibleNodes,
  };
};
