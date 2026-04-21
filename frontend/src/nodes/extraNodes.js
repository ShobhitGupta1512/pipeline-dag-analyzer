import React, { useState } from 'react';
import BaseNode from './BaseNode';
import { useStore } from '../store';
import './nodeFields.css';

/* ══════════════════════════════════════════
   1. MathNode
══════════════════════════════════════════ */
export const MathNode = ({ id, data }) => {
  const [op, setOp] = useState(data?.operation || '+');
  const updateField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id} title="Math" color="#f59e0b" icon="∑"
      inputs={[{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }]}
      outputs={[{ id: 'result', label: 'result' }]}
    >
      <div className="nf-row">
        <span className="nf-label">Operation</span>
        <select className="nf-select nodrag" value={op}
          onChange={(e) => { setOp(e.target.value); updateField(id, 'operation', e.target.value); }}>
          <option value="+">Add ( + )</option>
          <option value="-">Subtract ( − )</option>
          <option value="*">Multiply ( × )</option>
          <option value="/">Divide ( ÷ )</option>
          <option value="%">Modulo ( % )</option>
          <option value="**">Power ( ^ )</option>
        </select>
      </div>
      <div style={{ textAlign: 'center', fontSize: 22, color: '#f59e0b', opacity: 0.7 }}>{op}</div>
    </BaseNode>
  );
};

/* ══════════════════════════════════════════
   2. APINode
══════════════════════════════════════════ */
export const APINode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || 'https://api.example.com/');
  const updateField = useStore((s) => s.updateNodeField);
  const methodColors = { GET: '#10b981', POST: '#4f8ef7', PUT: '#f59e0b', DELETE: '#f43f5e', PATCH: '#8b5cf6' };

  return (
    <BaseNode
      id={id} title="API Call" color="#10b981" icon="⇌"
      inputs={[{ id: 'body', label: 'body' }, { id: 'headers', label: 'headers' }]}
      outputs={[{ id: 'response', label: 'response' }, { id: 'status', label: 'status' }]}
      minWidth={260}
    >
      <div className="nf-row">
        <span className="nf-label">Method</span>
        <select className="nf-select nodrag" value={method}
          style={{ color: methodColors[method] || '#e8eaf0' }}
          onChange={(e) => { setMethod(e.target.value); updateField(id, 'method', e.target.value); }}>
          {['GET','POST','PUT','DELETE','PATCH'].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="nf-row">
        <span className="nf-label">URL</span>
        <input className="nf-input nodrag" value={url} placeholder="https://..."
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => { setUrl(e.target.value); updateField(id, 'url', e.target.value); }} />
      </div>
    </BaseNode>
  );
};

/* ══════════════════════════════════════════
   3. LoggerNode
══════════════════════════════════════════ */
export const LoggerNode = ({ id, data }) => {
  const [label, setLabel] = useState(data?.label || 'debug');
  const [level, setLevel] = useState(data?.level || 'info');
  const updateField = useStore((s) => s.updateNodeField);
  const levelColor = { info: '#4f8ef7', warn: '#f59e0b', error: '#f43f5e', debug: '#8b5cf6' };

  return (
    <BaseNode
      id={id} title="Logger" color="#fb923c" icon="📋"
      inputs={[{ id: 'value', label: 'value' }]}
      outputs={[{ id: 'passthrough', label: 'passthrough' }]}
    >
      <div className="nf-row">
        <span className="nf-label">Label</span>
        <input className="nf-input nodrag" value={label}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => { setLabel(e.target.value); updateField(id, 'label', e.target.value); }} />
      </div>
      <div className="nf-row">
        <span className="nf-label">Level</span>
        <select className="nf-select nodrag" value={level}
          style={{ color: levelColor[level] }}
          onChange={(e) => { setLevel(e.target.value); updateField(id, 'level', e.target.value); }}>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
      </div>
      <span className="nf-badge nf-badge-amber">{level.toUpperCase()} · {label}</span>
    </BaseNode>
  );
};

/* ══════════════════════════════════════════
   4. ConditionNode
══════════════════════════════════════════ */
export const ConditionNode = ({ id, data }) => {
  const [operator, setOperator] = useState(data?.operator || '==');
  const [value, setValue] = useState(data?.value || '');
  const updateField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id} title="Condition" color="#f43f5e" icon="⑂"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'true', label: 'true ✓' }, { id: 'false', label: 'false ✗' }]}
      minWidth={240}
    >
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="nf-row" style={{ flex: '0 0 80px' }}>
          <span className="nf-label">Op</span>
          <select className="nf-select nodrag" value={operator}
            onChange={(e) => { setOperator(e.target.value); updateField(id, 'operator', e.target.value); }}>
            {['==','!=','>','<','>=','<=','contains','startsWith'].map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>
        <div className="nf-row" style={{ flex: 1 }}>
          <span className="nf-label">Value</span>
          <input className="nf-input nodrag" value={value} placeholder="compare to..."
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(e) => { setValue(e.target.value); updateField(id, 'value', e.target.value); }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="nf-badge" style={{ background:'rgba(16,185,129,0.12)', borderColor:'rgba(16,185,129,0.3)', color:'#10b981' }}>TRUE →</span>
        <span className="nf-badge nf-badge-rose">FALSE →</span>
      </div>
    </BaseNode>
  );
};

/* ══════════════════════════════════════════
   5. TransformNode
══════════════════════════════════════════ */
export const TransformNode = ({ id, data }) => {
  const [mode, setMode] = useState(data?.mode || 'map');
  const [code, setCode] = useState(data?.code || '(item) => item');
  const updateField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id} title="Transform" color="#8b5cf6" icon="⇄"
      inputs={[{ id: 'array', label: 'array' }]}
      outputs={[{ id: 'result', label: 'result' }]}
      minWidth={260}
    >
      <div className="nf-row">
        <span className="nf-label">Mode</span>
        <select className="nf-select nodrag" value={mode}
          onChange={(e) => { setMode(e.target.value); updateField(id, 'mode', e.target.value); }}>
          <option value="map">Map</option>
          <option value="filter">Filter</option>
          <option value="reduce">Reduce</option>
          <option value="sort">Sort</option>
          <option value="flatten">Flatten</option>
        </select>
      </div>
      <div className="nf-row">
        <span className="nf-label">Expression</span>
        <textarea className="nf-textarea nodrag nopan" value={code} rows={2}
          onKeyDown={(e) => e.stopPropagation()}
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
          onChange={(e) => { setCode(e.target.value); updateField(id, 'code', e.target.value); }} />
      </div>
      <span className="nf-badge nf-badge-violet">{mode}( fn )</span>
    </BaseNode>
  );
};