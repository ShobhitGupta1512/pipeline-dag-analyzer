import React, { useState } from 'react';
import BaseNode from './BaseNode';
import { useStore } from '../store';
import './nodeFields.css';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const updateField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="LLM"
      color="#8b5cf6"
      icon="✦"
      inputs={[
        { id: 'system', label: 'system' },
        { id: 'prompt', label: 'prompt' },
      ]}
      outputs={[{ id: 'response', label: 'response' }]}
      minWidth={240}
    >
      <div className="nf-row">
        <span className="nf-label">Model</span>
        <select
          className="nf-select nodrag"
          value={model}
          onChange={(e) => { setModel(e.target.value); updateField(id, 'model', e.target.value); }}
        >
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3-opus">Claude 3 Opus</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
          <option value="llama-3">Llama 3</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
        <span className="nf-badge nf-badge-violet">AI</span>
        <span className="nf-badge nf-badge-teal">Streaming</span>
      </div>
    </BaseNode>
  );
};