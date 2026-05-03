import { FIS, FISSchema, SuccessCriterion } from './fis';
import { IntentGap } from './state';
import { MissionDAG } from './dispatch';
import { LLMProvider } from './index';

export class MockLLMProvider implements LLMProvider {
  async generateFIS(nl: string): Promise<FIS> {
    // Mock implementation for testing
    return {
      id: '00000000-0000-0000-0000-000000000000',
      owner_email: 'team@example.com',
      statement_nl: nl,
      scope: { type: 'repo', identifier: 'auth-service' },
      criteria: [
        {
          id: 'criterion-1',
          description: 'P1 bugs should be zero (minimum 10 chars)',
          metricType: 'ticket_count',
          sensorType: 'tickets',
          operator: 'eq'
        }
      ],
      thresholds: { 'criterion-1': 0 },
      priority: 'P1',
      timeHorizon: 'continuous',
      status: 'active',
      created_at: new Date()
    };
  }

  async generateMissionDAG(gap: IntentGap): Promise<MissionDAG> {
    return {
      missions: [
        {
          id: 'mission-1',
          type: 'write_fix',
          requiredCapability: 'write_code',
          inputs: { gapId: gap.intentId },
          successCondition: 'Tests passed and PR opened',
          status: 'pending'
        }
      ],
      dependencies: {}
    };
  }
}
