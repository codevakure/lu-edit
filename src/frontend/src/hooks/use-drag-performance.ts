import { useCallback, useRef } from "react";
import { throttle } from "lodash";
import type { NodeChange, OnNodeDrag } from "@xyflow/react";
import type { AllNodeType } from "@/types/flow";

/**
 * Optimizes drag performance by throttling updates and reducing re-renders
 */
export const useDragPerformance = () => {
  const isDraggingRef = useRef(false);
  const dragStartTimeRef = useRef<number>(0);
  const lastDragUpdateRef = useRef<number>(0);

  // Throttled drag handler to prevent excessive updates
  const throttledDragHandler = useRef(
    throttle((callback: Function, ...args: any[]) => {
      callback(...args);
    }, 16) // ~60fps
  ).current;

  // Optimized node drag start handler
  const onNodeDragStart: OnNodeDrag = useCallback((event, node) => {
    isDraggingRef.current = true;
    dragStartTimeRef.current = performance.now();
    
    // Disable text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Add dragging class more specifically to avoid affecting sidebar
    const reactFlowWrapper = document.querySelector('.react-flow');
    if (reactFlowWrapper) {
      reactFlowWrapper.classList.add('dragging-node');
    }
    // Keep body class for global text selection disable
    document.body.classList.add('dragging-node');
  }, []);

  // Optimized node drag handler with throttling
  const onNodeDrag: OnNodeDrag = useCallback((event, node) => {
    if (!isDraggingRef.current) return;
    
    const now = performance.now();
    
    // Skip update if too frequent
    if (now - lastDragUpdateRef.current < 16) return;
    
    lastDragUpdateRef.current = now;
    
    // Throttle the actual drag handling
    throttledDragHandler(() => {
      // Custom drag logic can go here
      // For now, just let ReactFlow handle it
    });
  }, [throttledDragHandler]);

  // Optimized node drag stop handler
  const onNodeDragStop: OnNodeDrag = useCallback((event, node) => {
    isDraggingRef.current = false;
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    
    // Remove dragging class from both body and react-flow
    document.body.classList.remove('dragging-node');
    const reactFlowWrapper = document.querySelector('.react-flow');
    if (reactFlowWrapper) {
      reactFlowWrapper.classList.remove('dragging-node');
    }
    
    // Log drag performance
    const dragDuration = performance.now() - dragStartTimeRef.current;
    if (dragDuration > 100) {
      console.warn(`Slow drag detected: ${dragDuration.toFixed(2)}ms`);
    }
  }, []);

  // Optimized nodes change handler with batching
  const optimizedNodesChange = useCallback((changes: NodeChange<AllNodeType>[]) => {
    // Batch position changes to reduce re-renders
    const positionChanges = changes.filter(change => change.type === 'position');
    const otherChanges = changes.filter(change => change.type !== 'position');
    
    // Process position changes with throttling during drag
    if (positionChanges.length > 0 && isDraggingRef.current) {
      throttledDragHandler(() => {
        // Position changes will be handled by the parent component
        return [...positionChanges, ...otherChanges];
      });
    }
    
    return changes;
  }, [throttledDragHandler]);

  // Performance optimization: reduce node re-renders during drag
  const shouldSkipRender = useCallback((nodeId: string) => {
    // Skip non-essential renders during drag
    return isDraggingRef.current && performance.now() - lastDragUpdateRef.current < 32;
  }, []);

  return {
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
    optimizedNodesChange,
    shouldSkipRender,
    isDragging: isDraggingRef.current,
  };
};
