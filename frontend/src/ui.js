import React, { useRef, useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from './store';

import { InputNode }     from './nodes/inputNode';
import { OutputNode }    from './nodes/outputNode';
import { LLMNode }       from './nodes/llmNode';
import { TextNode }      from './nodes/textNode';
import { MathNode, APINode, LoggerNode, ConditionNode, TransformNode } from './nodes/extraNodes';

const nodeTypes = {
  customInput:  InputNode,
  customOutput: OutputNode,
  llm:          LLMNode,
  text:         TextNode,
  math:         MathNode,
  api:          APINode,
  logger:       LoggerNode,
  condition:    ConditionNode,
  transform:    TransformNode,
};

/* ── Custom deletable edge with ✕ button ── */
const DeletableEdge = ({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  style = {}, markerEnd, label, labelStyle, labelBgStyle,
}) => {
  const { onEdgesChange } = useStore();
  const [hovered, setHovered] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const deleteEdge = () => {
    onEdgesChange([{ id, type: 'remove' }]);
  };

  return (
    <>
      {/* Invisible wider stroke for easier hover/click */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Visible edge line */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: hovered ? '#f43f5e' : (style.stroke || '#4f8ef7'),
          strokeWidth: hovered ? 2 : 1.5,
          transition: 'stroke 0.15s ease, stroke-width 0.15s ease',
        }}
      />

      <EdgeLabelRenderer>
        {/* Edge label (handle names) */}
        {label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY - 14}px)`,
              pointerEvents: 'none',
              background: '#1a1e28',
              border: '1px solid #2e3347',
              borderRadius: 4,
              padding: '1px 6px',
              fontSize: 10,
              color: '#8b92a8',
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
        )}

        {/* Delete button — shown on hover */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + (label ? 10 : 0)}px)`,
              pointerEvents: 'all',
              cursor: 'pointer',
              background: '#f43f5e',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(244,63,94,0.5)',
              zIndex: 10,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={deleteEdge}
            title="Delete this connection"
          >
            ✕
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

const edgeTypes = { smoothstep: DeletableEdge };

/* ── Canvas ── */
const Canvas = () => {
  const reactFlowWrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    getNodeID, addNode,
  } = useStore();

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type || !rfInstance) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = rfInstance.project({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    const id = getNodeID(type);
    addNode({ id, type, position, data: { label: `${type} Node` } });
  }, [rfInstance, getNodeID, addNode]);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100vh', paddingTop: 56 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        snapToGrid={true}
        snapGrid={[16, 16]}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2f3d" />
        <Controls />
        <MiniMap
          nodeColor={(n) => ({
            customInput: '#4f8ef7', customOutput: '#f43f5e',
            llm: '#8b5cf6', text: '#2dd4bf', math: '#f59e0b',
            api: '#10b981', logger: '#fb923c',
            condition: '#f43f5e', transform: '#8b5cf6',
          }[n.type] || '#4a5068')}
          maskColor="rgba(13,15,20,0.8)"
        />
      </ReactFlow>
    </div>
  );
};

export const PipelineCanvas = () => (
  <ReactFlowProvider>
    <Canvas />
  </ReactFlowProvider>
);