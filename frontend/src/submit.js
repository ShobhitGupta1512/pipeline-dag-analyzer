// submit.js

import { useStore } from './store';

export const useSubmitPipeline = () => {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      const { num_nodes, num_edges, is_dag } = result;

      alert(
        `Pipeline Analysis\n` +
        `─────────────────\n` +
        `Nodes   : ${num_nodes}\n` +
        `Edges   : ${num_edges}\n` +
        `Is DAG  : ${is_dag ? '✓ Yes (no cycles)' : '✗ No (has cycles)'}`
      );
    } catch (err) {
      alert(`Failed to reach backend:\n${err.message}\n\nMake sure the FastAPI server is running on port 8000.`);
    }
  };

  return { handleSubmit };
};