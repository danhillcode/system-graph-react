'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import NodeControls from './NodeControls';
import ConnectionControls from './ConnectionControls';
import FileControls from './FileControls';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: 'sales',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      label: 'Sales',
      color: 'lightgreen',
      shape: 'box',
      attributes: { type: 'department', critical: true }
    },
  },
  {
    id: 'marketing',
    type: 'custom',
    position: { x: 300, y: 100 },
    data: {
      label: 'Marketing',
      color: 'lightcoral',
      shape: 'box',
      attributes: { type: 'department', critical: true }
    },
  },
  {
    id: 'promo',
    type: 'custom',
    position: { x: 500, y: 100 },
    data: {
      label: 'Promo',
      color: 'gold',
      shape: 'diamond',
      attributes: { type: 'campaign', critical: false }
    },
  },
  {
    id: 'customers',
    type: 'custom',
    position: { x: 300, y: 300 },
    data: {
      label: 'Customers',
      color: 'lightblue',
      shape: 'circle',
      attributes: { type: 'external', critical: true }
    },
  },
  {
    id: 'products',
    type: 'custom',
    position: { x: 100, y: 300 },
    data: {
      label: 'Products',
      color: 'lightpink',
      shape: 'box',
      attributes: { type: 'inventory', critical: true }
    },
  },
  {
    id: 'revenue',
    type: 'custom',
    position: { x: 500, y: 300 },
    data: {
      label: 'Revenue',
      color: 'lightgreen',
      shape: 'diamond',
      attributes: { type: 'financial', critical: true }
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'marketing-promo',
    source: 'marketing',
    target: 'promo',
    type: 'smoothstep',
    data: { type: 'creates', frequency: 'monthly' }
  },
  {
    id: 'promo-customers',
    source: 'promo',
    target: 'customers',
    type: 'smoothstep',
    data: { type: 'attracts', reach: '10000' }
  },
  {
    id: 'sales-customers',
    source: 'sales',
    target: 'customers',
    type: 'smoothstep',
    data: { type: 'converts', conversion_rate: '15%' }
  },
  {
    id: 'customers-revenue',
    source: 'customers',
    target: 'revenue',
    type: 'smoothstep',
    data: { type: 'generates', avg_value: 500 }
  },
  {
    id: 'products-sales',
    source: 'products',
    target: 'sales',
    type: 'smoothstep',
    data: { type: 'enables', inventory: 1000 }
  },
  {
    id: 'marketing-sales',
    source: 'marketing',
    target: 'sales',
    type: 'smoothstep',
    data: { type: 'supports', leads: 'qualified' }
  },
  {
    id: 'promo-sales',
    source: 'promo',
    target: 'sales',
    type: 'smoothstep',
    data: { type: 'boosts', lift: '25%' }
  },
];

const SystemGraph: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
        type: 'smoothstep',
        data: { type: 'user_created' }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleAddNode = useCallback(
    (name: string, color: string, shape: 'box' | 'circle' | 'diamond') => {
      const newNode: Node = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        type: 'custom',
        position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        data: {
          label: name,
          color,
          shape,
          attributes: { type: 'user_created', critical: false }
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      if (selectedNode === nodeId) {
        setSelectedNode(null);
      }
    },
    [setNodes, setEdges, selectedNode]
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, color: string, shape: 'box' | 'circle' | 'diamond') => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  color,
                  shape,
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const handleAddConnection = useCallback(
    (from: string, to: string) => {
      const newEdge: Edge = {
        id: `${from}-${to}`,
        source: from,
        target: to,
        type: 'smoothstep',
        data: { type: 'user_created' }
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    [setEdges]
  );

  const handleDeleteConnection = useCallback(
    (from: string, to: string) => {
      setEdges((eds) => eds.filter((edge) => !(edge.source === from && edge.target === to)));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const handleSave = useCallback(() => {
    const graphData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        data: edge.data
      })),
      metadata: {
        savedAt: new Date().toISOString(),
        version: '1.0',
        description: 'System Graph Export'
      }
    };

    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-graph-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleLoad = useCallback((data: any) => {
    if (data.nodes && data.edges) {
      setNodes(data.nodes);
      setEdges(data.edges);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Controls Panel */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            System Graph Builder
          </h1>
          
          <NodeControls
            onAddNode={handleAddNode}
            onDeleteNode={handleDeleteNode}
            onUpdateNode={handleUpdateNode}
            selectedNode={selectedNode}
            nodes={nodes}
          />
          
          <div className="mt-6">
            <ConnectionControls
              onAddConnection={handleAddConnection}
              onDeleteConnection={handleDeleteConnection}
              nodes={nodes}
              edges={edges}
            />
          </div>

          <div className="mt-6">
            <FileControls
              onSave={handleSave}
              onLoad={handleLoad}
            />
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default SystemGraph;

