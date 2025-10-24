export interface Node {
  id: string;
  type: string;
  data: {
    label: string;
    color: string;
    shape: 'box' | 'circle' | 'diamond';
    attributes: Record<string, any>;
  };
  position: { x: number; y: number };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, any>;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  directed: boolean;
}

export interface NodeAttributes {
  type: string;
  critical: boolean;
  [key: string]: any;
}
