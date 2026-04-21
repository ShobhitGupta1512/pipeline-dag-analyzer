import React from 'react';

/**
 * DraggableNode – a palette chip in the toolbar that can be
 * dragged onto the ReactFlow canvas to create a new node.
 *
 * Props:
 *   type  – ReactFlow node type string (must match nodeTypes key in ui.js)
 *   label – Display name shown in the chip
 *   color – Accent color for the left border / icon background
 *   icon  – Emoji or symbol shown in the chip
 */
export const DraggableNode = ({ type, label, color = '#4f8ef7', icon = '◈' }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={chipStyle(color)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color + '18';
        e.currentTarget.style.borderColor = color + '99';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = color + '44';
      }}
    >
      <span style={iconStyle(color)}>{icon}</span>
      <span style={labelStyle}>{label}</span>
    </div>
  );
};

/* ─── Styles ─── */

const chipStyle = (color) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '5px 11px 5px 7px',
  background: 'transparent',
  border: `1px solid ${color}44`,
  borderRadius: 7,
  cursor: 'grab',
  userSelect: 'none',
  transition: 'background 0.15s ease, border-color 0.15s ease',
  flexShrink: 0,
});

const iconStyle = (color) => ({
  width: 20,
  height: 20,
  borderRadius: 5,
  background: color + '22',
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 700,
  flexShrink: 0,
  lineHeight: 1,
});

const labelStyle = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 600,
  fontSize: 11,
  color: '#e8eaf0',
  whiteSpace: 'nowrap',
};

export default DraggableNode;