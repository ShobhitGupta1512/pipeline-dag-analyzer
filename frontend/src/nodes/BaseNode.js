import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * BaseNode — universal reusable node shell.
 *
 * Props:
 *   id        – ReactFlow node id
 *   title     – header text
 *   color     – accent hex (left bar + handle glow)
 *   icon      – emoji/symbol before title
 *   inputs    – [{ id, label, position? }]  handle id stored as-is (no prefix)
 *   outputs   – [{ id, label, position? }]
 *   minWidth  – px override (default 220)
 *   children  – body content
 */
const BaseNode = ({
  id,
  title,
  color = '#4f8ef7',
  icon = '◈',
  inputs = [],
  outputs = [],
  minWidth = 220,
  children,
}) => {
  return (
    <div style={nodeWrap(color, minWidth)}>
      {/* Left accent bar */}
      <div style={accentBar(color)} />

      {/* Header */}
      <div style={headerStyle}>
        <span style={iconStyle}>{icon}</span>
        <span style={titleStyle}>{title}</span>
      </div>

      {/* Body */}
      <div style={bodyStyle}>{children}</div>

      {/* ── Input Handles (left side) ── */}
      {inputs.map((inp, i) => (
        <React.Fragment key={inp.id}>
          <Handle
            type="target"
            position={inp.position || Position.Left}
            id={inp.id}                          // use raw id — no extra prefix
            style={{
              ...handleDot('#2dd4bf'),
              top: calcTop(i, inputs.length),
            }}
          />
          <span style={labelLeft(i, inputs.length)}>{inp.label}</span>
        </React.Fragment>
      ))}

      {/* ── Output Handles (right side) ── */}
      {outputs.map((out, i) => (
        <React.Fragment key={out.id}>
          <Handle
            type="source"
            position={out.position || Position.Right}
            id={out.id}                          // use raw id — no extra prefix
            style={{
              ...handleDot('#f59e0b'),
              top: calcTop(i, outputs.length),
            }}
          />
          <span style={labelRight(i, outputs.length)}>{out.label}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── Helpers ─── */

const calcTop = (index, total) => {
  if (total === 1) return '50%';
  const step = 100 / (total + 1);
  return `${step * (index + 1)}%`;
};

/* ─── Styles ─── */

const handleDot = (accent) => ({
  width: 10,
  height: 10,
  background: accent,
  border: '2px solid #0d0f14',
  borderRadius: '50%',
});

const labelLeft = (i, total) => ({
  position: 'absolute',
  top: calcTop(i, total),
  transform: 'translateY(-50%)',
  left: 14,
  fontSize: 10,
  color: '#8b92a8',
  fontFamily: 'JetBrains Mono, monospace',
  pointerEvents: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
});

const labelRight = (i, total) => ({
  position: 'absolute',
  top: calcTop(i, total),
  transform: 'translateY(-50%)',
  right: 14,
  fontSize: 10,
  color: '#8b92a8',
  fontFamily: 'JetBrains Mono, monospace',
  pointerEvents: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  textAlign: 'right',
});

const nodeWrap = (color, minWidth) => ({
  position: 'relative',
  minWidth,
  background: '#1a1e28',
  border: '1px solid #2e3347',
  borderRadius: 10,
  boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
  overflow: 'visible',
  cursor: 'grab',
});

const accentBar = (color) => ({
  position: 'absolute',
  left: 0, top: 0, bottom: 0,
  width: 3,
  background: color,
  borderRadius: '10px 0 0 10px',
});

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  padding: '9px 12px 9px 14px',
  background: '#1f2433',
  borderBottom: '1px solid #2e3347',
  borderRadius: '10px 10px 0 0',
};

const iconStyle = { fontSize: 14, lineHeight: 1, flexShrink: 0 };

const titleStyle = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 700,
  fontSize: 12,
  color: '#e8eaf0',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const bodyStyle = {
  padding: '10px 12px 10px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

export default BaseNode;