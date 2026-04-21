import React, { useState } from 'react';
import BaseNode from './BaseNode';
import { useStore } from '../store';
import './nodeFields.css';

export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.inputName || 'input_0');
  const [type, setType] = useState(data?.inputType || 'Text');
  const updateField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Input"
      color="#4f8ef7"
      icon="⬇"
      outputs={[{ id: 'value', label: 'value' }]}
    >
      <div className="nf-row">
        <span className="nf-label">Name</span>
        <input
          className="nf-input nodrag"
          value={name}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => { setName(e.target.value); updateField(id, 'inputName', e.target.value); }}
        />
      </div>
      <div className="nf-row">
        <span className="nf-label">Type</span>
        <select
          className="nf-select nodrag"
          value={type}
          onChange={(e) => { setType(e.target.value); updateField(id, 'inputType', e.target.value); }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
          <option value="Image">Image</option>
          <option value="Number">Number</option>
        </select>
      </div>
    </BaseNode>
  );
};