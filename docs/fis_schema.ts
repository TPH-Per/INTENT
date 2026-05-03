/**
 * Formal Intent Specification (FIS)
 * Defines what "good" looks like for a specific domain/scope.
 */
export interface FIS {
  id: string; // Unique identifier (UUID)
  owner: string; // Team/User identifier
  statement_nl: string; // Natural Language statement of intent
  scope: {
    type: 'repo' | 'service' | 'team' | 'org';
    identifier: string;
  };
  criteria: SuccessCriterion[];
  thresholds: {
    [criterionId: string]: number | string | boolean;
  };
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  timeHorizon: 'continuous' | 'deadline';
  deadline?: Date;
  status: 'active' | 'archived' | 'pending';
}

export interface SuccessCriterion {
  id: string;
  description: string;
  metricType: 'latency' | 'error_rate' | 'availability' | 'ticket_count' | 'custom';
  sensorType: 'code' | 'metrics' | 'tickets' | 'logs';
}
