'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  color: string;
  shape: 'box' | 'circle' | 'diamond';
  attributes: Record<string, any>;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const { label, color, shape } = data;

  const getShapeStyle = () => {
    const baseStyle = {
      backgroundColor: color,
      border: selected ? '3px solid #3b82f6' : '2px solid #1e40af',
      borderRadius: shape === 'circle' ? '50%' : shape === 'diamond' ? '0' : '8px',
      transform: shape === 'diamond' ? 'rotate(45deg)' : 'none',
      width: '120px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    };

    return baseStyle;
  };

  const getTextStyle = () => ({
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: '12px',
    textAlign: 'center' as const,
    transform: shape === 'diamond' ? 'rotate(-45deg)' : 'none',
    zIndex: 1,
  });

  return (
    <div style={getShapeStyle()}>
      <div style={getTextStyle()}>
        {label}
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555', width: '8px', height: '8px' }}
      />
    </div>
  );
};

export default CustomNode;

