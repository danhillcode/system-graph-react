'use client';

import React, { useState } from 'react';
import { Link, Unlink } from 'lucide-react';

interface ConnectionControlsProps {
  onAddConnection: (from: string, to: string) => void;
  onDeleteConnection: (from: string, to: string) => void;
  nodes: Array<{ id: string; data: { label: string } }>;
  edges: Array<{ id: string; source: string; target: string }>;
}

const ConnectionControls: React.FC<ConnectionControlsProps> = ({
  onAddConnection,
  onDeleteConnection,
  nodes,
  edges
}) => {
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');

  const handleAddConnection = () => {
    if (fromNode && toNode && fromNode !== toNode) {
      onAddConnection(fromNode, toNode);
      setFromNode('');
      setToNode('');
    }
  };

  const handleDeleteConnection = () => {
    if (fromNode && toNode) {
      onDeleteConnection(fromNode, toNode);
      setFromNode('');
      setToNode('');
    }
  };

  const existingConnections = edges.map(edge => `${edge.source} → ${edge.target}`);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Link className="w-5 h-5" />
        Connection Controls
      </h3>
      
      {/* From Node */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From Node
        </label>
        <select
          value={fromNode}
          onChange={(e) => setFromNode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select source node...</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.data.label}
            </option>
          ))}
        </select>
      </div>

      {/* To Node */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          To Node
        </label>
        <select
          value={toNode}
          onChange={(e) => setToNode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select target node...</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.data.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAddConnection}
          disabled={!fromNode || !toNode || fromNode === toNode}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Link size={16} />
          Add Connection
        </button>
        <button
          onClick={handleDeleteConnection}
          disabled={!fromNode || !toNode}
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Unlink size={16} />
          Delete
        </button>
      </div>

      {/* Existing Connections */}
      {existingConnections.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Existing Connections
          </label>
          <div className="max-h-32 overflow-y-auto">
            {existingConnections.map((connection, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 py-1 px-2 bg-gray-50 rounded mb-1"
              >
                {connection}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionControls;

