import { FIS, SuccessCriterion } from './fis';

export interface StateObservation {
  type: 'code' | 'metrics' | 'tickets' | 'logs';
  source: string;
  value: any;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface IntentGap {
  intentId: string;
  criterionId: string;
  currentValue: any;
  targetValue: any;
  gapScore: number;
  timestamp: Date;
}
