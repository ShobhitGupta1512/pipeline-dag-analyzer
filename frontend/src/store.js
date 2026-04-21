// store.js
import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],

  getNodeID: (type) => {
    const ids = get().nodes
      .filter((n) => n.type === type)
      .map((n) => parseInt(n.id.split('-').pop(), 10))
      .filter((n) => !isNaN(n));
    return `${type}-${ids.length > 0 ? Math.max(...ids) + 1 : 0}`;
  },

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  // Delete selected nodes AND their connected edges
  onNodesChange: (changes) =>
    set((state) => {
      const deletedIds = changes
        .filter((c) => c.type === 'remove')
        .map((c) => c.id);
      const newNodes = applyNodeChanges(changes, state.nodes);
      const newEdges = deletedIds.length
        ? state.edges.filter(
            (e) => !deletedIds.includes(e.source) && !deletedIds.includes(e.target)
          )
        : state.edges;
      return { nodes: newNodes, edges: newEdges };
    }),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => {
      // Build edge label from handle IDs e.g. "prompt -> response"
      const src = connection.sourceHandle ? connection.sourceHandle.split('-').slice(1).join('-') : '';
      const tgt = connection.targetHandle ? connection.targetHandle.split('-').slice(1).join('-') : '';
      const label = src && tgt ? src + ' \u2192 ' + tgt : undefined;

      return {
        edges: addEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
            label,
            labelStyle: {
              fill: '#8b92a8',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
            },
            labelBgStyle: { fill: '#1a1e28', fillOpacity: 0.85 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#4f8ef7' },
            style: { stroke: '#4f8ef7', strokeWidth: 1.5 },
          },
          state.edges
        ),
      };
    }),

  // Clear entire canvas
  clearCanvas: () => set({ nodes: [], edges: [] }),

  updateNodeField: (nodeId, fieldName, fieldValue) =>
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id === nodeId) {
          return { ...n, data: { ...n.data, [fieldName]: fieldValue } };
        }
        return n;
      }),
    })),
}));