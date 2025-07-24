import { memo, useCallback, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import type { AllNodeType } from "@/types/flow";
import GenericNode from "@/CustomNodes/GenericNode";
import NoteNode from "@/CustomNodes/NoteNode";

interface VirtualizedNodeWrapperProps {
  node: AllNodeType;
  selected?: boolean;
  xPos?: number;
  yPos?: number;
}

/**
 * Virtualized wrapper for nodes that only renders when in viewport
 * This helps with performance when dealing with large numbers of nodes
 */
const VirtualizedNodeWrapper = memo(({
  node,
  selected,
  xPos,
  yPos,
}: VirtualizedNodeWrapperProps) => {
  const { getViewport } = useReactFlow();
  
  // Check if node is in viewport with buffer
  const isInViewport = useMemo(() => {
    const viewport = getViewport();
    const buffer = 200; // Buffer around viewport
    const viewportWidth = window.innerWidth / viewport.zoom;
    const viewportHeight = window.innerHeight / viewport.zoom;
    
    const visibleBounds = {
      left: -viewport.x / viewport.zoom - buffer,
      right: (-viewport.x + viewportWidth) / viewport.zoom + buffer,
      top: -viewport.y / viewport.zoom - buffer,
      bottom: (-viewport.y + viewportHeight) / viewport.zoom + buffer,
    };

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
  }, [node.position, node.measured, getViewport]);

  // Render placeholder for out-of-viewport nodes
  if (!isInViewport) {
    return (
      <div
        style={{
          width: node.measured?.width || 200,
          height: node.measured?.height || 100,
          backgroundColor: 'transparent',
          border: '1px dashed rgba(0,0,0,0.1)',
        }}
      />
    );
  }

  // Render actual node component based on type
  if (node.type === 'noteNode') {
    return (
      <NoteNode
        data={node.data}
        selected={selected}
        xPos={xPos}
        yPos={yPos}
      />
    );
  }

  return (
    <GenericNode
      data={node.data}
      selected={selected}
      xPos={xPos}
      yPos={yPos}
    />
  );
});

VirtualizedNodeWrapper.displayName = 'VirtualizedNodeWrapper';

export default VirtualizedNodeWrapper;
