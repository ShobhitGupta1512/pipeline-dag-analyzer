import React from 'react';
import { DraggableNode } from './draggableNode';
import { useStore } from './store';

const NODE_PALETTE = [
  { type: 'customInput',  label: 'Input',     color: '#4f8ef7', icon: '⬇' },
  { type: 'customOutput', label: 'Output',    color: '#f43f5e', icon: '⬆' },
  { type: 'text',         label: 'Text',      color: '#2dd4bf', icon: 'T' },
  { type: 'llm',          label: 'LLM',       color: '#8b5cf6', icon: '✦' },
  { type: 'math',         label: 'Math',      color: '#f59e0b', icon: '∑' },
  { type: 'api',          label: 'API',       color: '#10b981', icon: '⇌' },
  { type: 'logger',       label: 'Logger',    color: '#fb923c', icon: '📋' },
  { type: 'condition',    label: 'Condition', color: '#f43f5e', icon: '⑂' },
  { type: 'transform',    label: 'Transform', color: '#8b5cf6', icon: '⇄' },
];

export const Toolbar = ({ onSubmit }) => {
  const clearCanvas = useStore((s) => s.clearCanvas);

  return (
    <div style={toolbarStyle}>
      {/* Logo */}
      <span style={logoStyle}>
        Vector<span style={{ color: '#4f8ef7' }}>Shift</span>
      </span>
      <div style={divider} />

      {/* Node palette */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'nowrap' }}>
        {NODE_PALETTE.map((n) => (
          <DraggableNode key={n.type} type={n.type} label={n.label} color={n.color} icon={n.icon} />
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Clear button */}
      <button
        onClick={clearCanvas}
        title="Clear all nodes and edges"
        style={{ ...btnBase, background: 'transparent', color: '#8b92a8', border: '1px solid #2e3347' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f43f5e'; e.currentTarget.style.color = '#f43f5e'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2e3347'; e.currentTarget.style.color = '#8b92a8'; }}
      >
        ✕ Clear
      </button>

      {/* Run button */}
      <button
        onClick={onSubmit}
        style={{ ...btnBase, background: '#4f8ef7', color: '#fff', border: 'none' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#3a7de8')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#4f8ef7')}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        ▶ Run Pipeline
      </button>
    </div>
  );
};

const toolbarStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, height: 56,
  background: '#13161d', borderBottom: '1px solid #2a2f3d',
  display: 'flex', alignItems: 'center', padding: '0 16px',
  gap: 6, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
  overflowX: 'auto',
};
const logoStyle = {
  fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16,
  color: '#e8eaf0', letterSpacing: '-0.02em', marginRight: 8, flexShrink: 0,
};
const divider = {
  width: 1, height: 32, background: '#2a2f3d', marginRight: 4, flexShrink: 0,
};
const btnBase = {
  padding: '6px 14px', borderRadius: 7,
  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11,
  cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase',
  transition: 'all 0.15s ease', flexShrink: 0,
};