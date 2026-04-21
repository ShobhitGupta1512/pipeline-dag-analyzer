import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Position } from 'reactflow';
import BaseNode from './BaseNode';
import { useStore } from '../store';
import './nodeFields.css';

/* Extract unique {{variable}} names preserving order */
const extractVars = (text) => {
  const seen = new Set();
  const result = [];
  for (const m of text.matchAll(/\{\{(\w+)\}\}/g)) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      result.push(m[1]);
    }
  }
  return result;
};

export const TextNode = ({ id, data }) => {
  const initialText = data?.text || 'Hello {{name}}!';
  const [text, setText] = useState(initialText);
  const [vars, setVars] = useState(() => extractVars(initialText));
  const textareaRef = useRef(null);
  const updateField = useStore((s) => s.updateNodeField);

  /* Auto-resize: run after every text change and on mount */
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);

  useEffect(() => { autoResize(); }, [text, autoResize]);

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    updateField(id, 'text', val);
    setVars(extractVars(val));
  };

  /* One handle per unique variable — id must be a plain string */
  const inputs = vars.map((v) => ({
    id: v,
    label: v,
    position: Position.Left,
  }));

  /* Grow body height so handles don't overlap */
  const bodyMinHeight = Math.max(80, vars.length * 28 + 50);

  return (
    <BaseNode
      id={id}
      title="Text"
      color="#2dd4bf"
      icon="T"
      inputs={inputs}
      outputs={[{ id: 'output', label: 'output' }]}
      minWidth={260}
    >
      <div className="nf-row" style={{ minHeight: bodyMinHeight }}>
        <span className="nf-label">Template</span>
        {/*
          nodrag  — tells ReactFlow not to start a node-drag when user clicks here
          nopan   — prevents canvas pan when dragging inside textarea
          onKeyDown stopPropagation — stops Delete/Backspace from deleting the node
        */}
        <textarea
          ref={textareaRef}
          className="nf-textarea nodrag nopan"
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => e.stopPropagation()}
          rows={2}
          style={{ overflowY: 'hidden' }}
          placeholder="Use {{variable}} for dynamic handles"
        />
      </div>

      {vars.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {vars.map((v) => (
            <span key={v} className="nf-badge nf-badge-teal">
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};