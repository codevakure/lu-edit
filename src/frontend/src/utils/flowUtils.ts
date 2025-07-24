import type { Node } from "@xyflow/react";
import type { NodeDataType } from "../types/flow";
import { isInputNode, isOutputNode } from "./reactflowUtils";

/**
 * Utility functions for flow analysis and manipulation
 */

/**
 * Extracts input and output nodes from a flow
 * @param nodes - Array of flow nodes
 * @returns Object containing arrays of input and output nodes with proper format
 */
export function getInputsAndOutputs(nodes: Node[]) {
  const inputs: {
    type: string;
    id: string;
    displayName: string;
  }[] = [];
  const outputs: {
    type: string;
    id: string;
    displayName: string;
  }[] = [];
  
  nodes.forEach((node) => {
    const nodeData: NodeDataType = node.data as NodeDataType;
    if (isOutputNode(nodeData)) {
      outputs.push({
        type: nodeData.type,
        id: nodeData.id,
        displayName: nodeData.node?.display_name ?? nodeData.id,
      });
    }
    if (isInputNode(nodeData)) {
      inputs.push({
        type: nodeData.type,
        id: nodeData.id,
        displayName: nodeData.node?.display_name ?? nodeData.id,
      });
    }
  });
  
  return { inputs, outputs };
}
