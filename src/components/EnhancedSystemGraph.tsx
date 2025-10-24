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

// Enhanced initial nodes with the 5 new features
const enhancedInitialNodes: Node[] = [
  // Core Business System
  {
    id: 'sales',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      label: 'Sales',
      color: 'lightgreen',
      shape: 'box',
      layer: 'patterns',
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
      layer: 'patterns',
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
      layer: 'events',
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
      layer: 'events',
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
      layer: 'structures',
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
      layer: 'mental_models',
      attributes: { type: 'financial', critical: true }
    },
  },

  // 1. Reflection & Feedback Loop
  {
    id: 'test_model',
    type: 'custom',
    position: { x: 700, y: 100 },
    data: {
      label: 'Test Model',
      color: 'lightcyan',
      shape: 'box',
      layer: 'mental_models',
      attributes: { type: 'learning', critical: true }
    },
  },
  {
    id: 'observe',
    type: 'custom',
    position: { x: 700, y: 200 },
    data: {
      label: 'Observe',
      color: 'lightcyan',
      shape: 'circle',
      layer: 'events',
      attributes: { type: 'learning', critical: true }
    },
  },
  {
    id: 'feedback',
    type: 'custom',
    position: { x: 700, y: 300 },
    data: {
      label: 'Feedback',
      color: 'lightcyan',
      shape: 'diamond',
      layer: 'patterns',
      attributes: { type: 'learning', critical: true }
    },
  },
  {
    id: 'reflect',
    type: 'custom',
    position: { x: 700, y: 400 },
    data: {
      label: 'Reflect',
      color: 'lightcyan',
      shape: 'box',
      layer: 'mental_models',
      attributes: { type: 'learning', critical: true }
    },
  },
  {
    id: 'update_model',
    type: 'custom',
    position: { x: 700, y: 500 },
    data: {
      label: 'Update Model',
      color: 'lightcyan',
      shape: 'diamond',
      layer: 'mental_models',
      attributes: { type: 'learning', critical: true }
    },
  },

  // 2. DSRP Framework
  {
    id: 'dsrp_framework',
    type: 'custom',
    position: { x: 100, y: 500 },
    data: {
      label: 'DSRP Framework',
      color: 'lightyellow',
      shape: 'box',
      layer: 'mental_models',
      dsrp: { D: [], S: [], R: [], P: [] },
      attributes: { type: 'framework', critical: true }
    },
  },

  // 3. Perspectives & Emotional Intelligence
  {
    id: 'user_perspective',
    type: 'custom',
    position: { x: 300, y: 500 },
    data: {
      label: 'User Perspective',
      color: 'lightpink',
      shape: 'circle',
      layer: 'mental_models',
      affect: { emotion: 'frustration', intensity: 0.6 },
      attributes: { type: 'perspective', critical: false }
    },
  },
  {
    id: 'developer_perspective',
    type: 'custom',
    position: { x: 500, y: 500 },
    data: {
      label: 'Developer Perspective',
      color: 'lightblue',
      shape: 'circle',
      layer: 'mental_models',
      affect: { emotion: 'confidence', intensity: 0.8 },
      attributes: { type: 'perspective', critical: false }
    },
  },

  // 4. Meaning vs Information Layer
  {
    id: 'product_ready',
    type: 'custom',
    position: { x: 100, y: 700 },
    data: {
      label: 'Product Ready',
      color: 'lightgreen',
      shape: 'box',
      layer: 'events',
      information_payload: 'Product is ready.',
      interpretation: 'Team believes launch tomorrow.',
      attributes: { type: 'communication', critical: true }
    },
  },
];

const enhancedInitialEdges: Edge[] = [
  // Original business connections
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

  // 1. Learning Loop
  {
    id: 'test_model-observe',
    source: 'test_model',
    target: 'observe',
    type: 'smoothstep',
    data: { type: 'learning_loop', role: 'system' }
  },
  {
    id: 'observe-feedback',
    source: 'observe',
    target: 'feedback',
    type: 'smoothstep',
    data: { type: 'learning_loop', role: 'system' }
  },
  {
    id: 'feedback-reflect',
    source: 'feedback',
    target: 'reflect',
    type: 'smoothstep',
    data: { type: 'learning_loop', role: 'system' }
  },
  {
    id: 'reflect-update_model',
    source: 'reflect',
    target: 'update_model',
    type: 'smoothstep',
    data: { type: 'learning_loop', role: 'system' }
  },
  {
    id: 'update_model-test_model',
    source: 'update_model',
    target: 'test_model',
    type: 'smoothstep',
    data: { type: 'learning_loop', role: 'system' }
  },

  // 2. DSRP Connections
  {
    id: 'dsrp-sales',
    source: 'dsrp_framework',
    target: 'sales',
    type: 'smoothstep',
    data: { type: 'dsrp', role: 'system' }
  },

  // 3. Perspective Connections
  {
    id: 'user_perspective-product_ready',
    source: 'user_perspective',
    target: 'product_ready',
    type: 'smoothstep',
    data: { type: 'sees_as', note: 'too complex', role: 'perspective' }
  },
  {
    id: 'developer_perspective-product_ready',
    source: 'developer_perspective',
    target: 'product_ready',
    type: 'smoothstep',
    data: { type: 'sees_as', note: 'ready to ship', role: 'perspective' }
  },

  // 4. Meaning vs Information
  {
    id: 'product_ready-sales',
    source: 'product_ready',
    target: 'sales',
    type: 'smoothstep',
    data: { type: 'transfers', role: 'information' }
  },
  {
    id: 'product_ready-marketing',
    source: 'product_ready',
    target: 'marketing',
    type: 'smoothstep',
    data: { type: 'construes', role: 'meaning' }
  },
];

const EnhancedSystemGraph: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(enhancedInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(enhancedInitialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showEnhanced, setShowEnhanced] = useState(false);

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
          layer: 'events', // Default layer
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
        version: '2.0',
        description: 'Enhanced System Graph with Learning Features',
        loops: [
          { id: 'learning_loop', purpose: 'update mental models through feedback' }
        ],
        features: [
          'reflection_feedback_loop',
          'iceberg_model_layers',
          'dsrp_framework',
          'perspectives_emotional_intelligence',
          'meaning_vs_information'
        ]
      }
    };

    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced-system-graph-${new Date().toISOString().split('T')[0]}.json`;
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

  const toggleEnhanced = useCallback(() => {
    setShowEnhanced(!showEnhanced);
  }, [showEnhanced]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Controls Panel */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Enhanced System Graph
            </h1>
            <button
              onClick={toggleEnhanced}
              className={`px-3 py-1 rounded text-sm font-medium ${
                showEnhanced 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {showEnhanced ? 'Enhanced ON' : 'Enhanced OFF'}
            </button>
          </div>
          
          {showEnhanced && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🧠 Enhanced Features Active:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 🔄 Learning Loop (Test → Observe → Feedback → Reflect → Update)</li>
                <li>• 🧊 Iceberg Layers (Events → Patterns → Structures → Mental Models)</li>
                <li>• 🎯 DSRP Framework (Distinctions, Systems, Relationships, Perspectives)</li>
                <li>• 👥 Multiple Perspectives with Emotional Intelligence</li>
                <li>• 💭 Meaning vs Information Layer</li>
              </ul>
            </div>
          )}
          
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

export default EnhancedSystemGraph;
