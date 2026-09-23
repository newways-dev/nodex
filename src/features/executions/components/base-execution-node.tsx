"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { NodeCard } from "@/components/react-flow/node-card";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
};

export const BaseExecutionNode = memo(
  ({
    id,
    type,
    icon,
    name,
    description,
    children,
    status = "initial",
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
      setEdges((currentEdges) =>
        currentEdges.filter((edge) => edge.source !== id && edge.target !== id),
      );
    };

    return (
      <WorkflowNode onDelete={handleDelete} onSettings={onSettings}>
        <NodeCard
          type={type}
          icon={icon}
          name={name}
          description={description}
          status={status}
          onDoubleClick={onDoubleClick}
        >
          {children}
          <BaseHandle id="target-1" type="target" position={Position.Left} />
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </NodeCard>
      </WorkflowNode>
    )
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";
