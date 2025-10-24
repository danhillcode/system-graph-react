'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Palette, Square, Circle, Diamond } from 'lucide-react';

interface NodeControlsProps {
  onAddNode: (name: string, color: string, shape: 'box' | 'circle' | 'diamond') => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateNode: (nodeId: string, color: string, shape: 'box' | 'circle' | 'diamond') => void;
  selectedNode: string | null;
  nodes: Array<{ id: string; data: { label: string; color: string; shape: 'box' | 'circle' | 'diamond' } }>;
}

const NodeControls: React.FC<NodeControlsProps> = ({
  onAddNode,
  onDeleteNode,
  onUpdateNode,
  selectedNode,
  nodes
}) => {
  const [newNodeName, setNewNodeName] = useState('');
  const [selectedColor, setSelectedColor] = useState('lightblue');
  const [selectedShape, setSelectedShape] = useState<'box' | 'circle' | 'diamond'>('box');

  const colors = [
    { name: 'Light Blue', value: 'lightblue' },
    { name: 'Red', value: 'red' },
    { name: 'Green', value: 'green' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Purple', value: 'purple' },
    { name: 'Orange', value: 'orange' },
    { name: 'Pink', value: 'pink' },
    { name: 'Cyan', value: 'cyan' },
  ];

  const handleAddNode = () => {
    if (newNodeName.trim()) {
      onAddNode(newNodeName.trim(), selectedColor, selectedShape);
      setNewNodeName('');
    }
  };

  const handleUpdateNode = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode, selectedColor, selectedShape);
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      onDeleteNode(selectedNode);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-lg font-semibold mb-4">Node Controls</h3>
      
      {/* Add New Node */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add New Node
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            placeholder="Node name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddNode}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette className="inline w-4 h-4 mr-1" />
          Color
        </label>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`p-2 rounded-md border-2 ${
                selectedColor === color.value
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-300'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Shape Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shape
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedShape('box')}
            className={`p-2 rounded-md border-2 ${
              selectedShape === 'box'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <Square size={20} />
          </button>
          <button
            onClick={() => setSelectedShape('circle')}
            className={`p-2 rounded-md border-2 ${
              selectedShape === 'circle'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <Circle size={20} />
          </button>
          <button
            onClick={() => setSelectedShape('diamond')}
            className={`p-2 rounded-md border-2 ${
              selectedShape === 'diamond'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <Diamond size={20} />
          </button>
        </div>
      </div>

      {/* Node Selection and Actions */}
      {nodes.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Node to Modify
          </label>
          <select
            value={selectedNode || ''}
            onChange={(e) => {
              const nodeId = e.target.value;
              if (nodeId) {
                const node = nodes.find(n => n.id === nodeId);
                if (node) {
                  setSelectedColor(node.data.color);
                  setSelectedShape(node.data.shape);
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a node...</option>
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.data.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleUpdateNode}
          disabled={!selectedNode}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Update Selected
        </button>
        <button
          onClick={handleDeleteNode}
          disabled={!selectedNode}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default NodeControls;

