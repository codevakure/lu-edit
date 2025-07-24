import { useMemo } from "react";
import { memoize } from "lodash";
import type { AllNodeType, EdgeType } from "@/types/flow";
import type { APIClassType } from "@/types/api";

/**
 * Memoized utility functions for ReactFlow operations
 * These functions cache results to prevent expensive recalculations
 */

// Memoize expensive validation functions
export const memoizedIsValidConnection = memoize(
  (sourceId: string, targetId: string, sourceHandle: string, targetHandle: string) => {
    // Add your connection validation logic here
    if (sourceId === targetId) return false;
    // Add more validation as needed
    return true;
  },
  // Custom resolver for cache key
  (sourceId, targetId, sourceHandle, targetHandle) => 
    `${sourceId}-${targetId}-${sourceHandle}-${targetHandle}`
);

// Memoize node type checking
export const memoizedCheckNodeType = memoize(
  (nodeType: string, targetType: string) => {
    return nodeType === targetType;
  }
);

// Memoize template field processing
export const memoizedProcessTemplateFields = memoize(
  (template: Record<string, any>) => {
    const processedFields: Record<string, any> = {};
    
    Object.keys(template).forEach((key) => {
      const field = template[key];
      processedFields[key] = {
        ...field,
        // Add any expensive processing here
        processed: true,
      };
    });
    
    return processedFields;
  },
  // Use JSON.stringify for complex object cache keys
  (template) => JSON.stringify(template)
);

// Memoize edge cleaning operations
export const memoizedCleanEdges = memoize(
  (nodeIds: string[], edges: EdgeType[]) => {
    return edges.filter((edge) => 
      nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
    );
  },
  // Create cache key from node IDs and edge IDs
  (nodeIds, edges) => `${nodeIds.sort().join(',')}-${edges.map(e => e.id).sort().join(',')}`
);

// Memoize node position calculations
export const memoizedCalculateNodePositions = memoize(
  (nodes: AllNodeType[]) => {
    const positions = new Map();
    
    nodes.forEach((node) => {
      positions.set(node.id, {
        x: node.position.x,
        y: node.position.y,
        width: node.measured?.width || 200,
        height: node.measured?.height || 100,
      });
    });
    
    return positions;
  },
  // Cache based on node positions
  (nodes) => nodes.map(n => `${n.id}-${n.position.x}-${n.position.y}`).join(',')
);

// Hook for using memoized node filtering
export const useMemoizedNodeFiltering = (nodes: AllNodeType[], filterCriteria: any) => {
  return useMemo(() => {
    if (!filterCriteria) return nodes;
    
    return nodes.filter((node) => {
      // Add your filtering logic here
      return true; // Placeholder
    });
  }, [nodes, filterCriteria]);
};

// Hook for memoized edge calculations
export const useMemoizedEdgeCalculations = (edges: EdgeType[], nodes: AllNodeType[]) => {
  return useMemo(() => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    return edges.map((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      
      return {
        ...edge,
        // Add any expensive edge calculations here
        isValid: !!(sourceNode && targetNode),
      };
    });
  }, [edges, nodes]);
};

// Clear all memoization caches (useful for cleanup)
export const clearMemoizationCaches = () => {
  memoizedIsValidConnection.cache.clear?.();
  memoizedCheckNodeType.cache.clear?.();
  memoizedProcessTemplateFields.cache.clear?.();
  memoizedCleanEdges.cache.clear?.();
  memoizedCalculateNodePositions.cache.clear?.();
};
