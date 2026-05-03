import { FIS, FISSchema } from './fis';
import { IntentGap } from './state';
import { MissionDAG } from './dispatch';

export class MockLLMProvider implements LLMProvider {
  async generateFIS(nl: string): Promise<FIS> {
    // Mock implementation for testing
    return {
      id: '00000000-0000-0000-0000-000000000000',
      owner: 'team-alpha',
      statement_nl: nl,
      scope: { type: 'repo', identifier: 'auth-service' },
      criteria: [
        {
          id: 'criterion-1',
          description: 'P1 bugs should be zero',
          metricType: 'ticket_count',
          sensorType: 'tickets'
        }
      ],
      thresholds: { 'criterion-1': 0 },
      priority: 'P1',
      timeHorizon: 'continuous',
      status: 'active'
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
