/**
 * State Graph Schema
 * Represents the observable signals and their relationships.
 */
export interface StateNode {
  id: string; // Unique identifier for the signal
  type: string; // Type of sensor/signal
  value: any; // Current value
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface StateEdge {
  source: string; // Node ID
  target: string; // Node ID
  relationship: 'causes' | 'influences' | 'correlates';
  weight: number;
}

export interface StateDelta {
  intentId: string;
  criterionId: string;
  currentValue: any;
  targetValue: any;
  gapScore: number; // Normalized 0-1 score where 1 is maximum gap
  timestamp: Date;
}

export interface StateGraph {
  nodes: StateNode[];
  edges: StateEdge[];
  deltas: StateDelta[];
}
