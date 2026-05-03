import { IntentGap, EventBus, FIS } from '@intent/core';
import { SemanticStateEngineAgent } from './state_engine';

export type Verdict = 'SATISFIED' | 'PARTIAL' | 'FAILED' | 'REGRESSED';

export interface VerdictResult {
  actionId: string;
  verdict: Verdict;
  reasoning: string;
  timestamp: Date;
}

export class VerificationCourtAgent {
  constructor(
    private eventBus: EventBus,
    private stateEngine: SemanticStateEngineAgent,
    private getIntentById: (id: string) => Promise<FIS>
  ) {}

  async evaluateAction(actionId: string, intentId: string): Promise<VerdictResult> {
    console.log(`VerificationCourt: Independently evaluating action ${actionId} for intent ${intentId}`);

    // 1. Re-read live state (in production, we'd trigger a fresh sensor poll or read from time-series DB)
    // Here we simulate getting the current gap from the state engine
    const currentIntents = await this.getIntentById(intentId);
    
    // Simulating a fresh gap check
    // In a real system, this would read from the latest metrics/logs
    const verdict: Verdict = 'SATISFIED'; // Mocked success
    
    const result: VerdictResult = {
      actionId,
      verdict,
      reasoning: 'Live state shows intent criteria are now met.',
      timestamp: new Date()
    };

    // 2. Emit verdict event
    await this.eventBus.emit('intent.verdict.issued', result);
    
    return result;
  }

  async onMissionResult(payload: { missionId: string, status: string, intentId: string }) {
    if (payload.status === 'completed') {
      await this.evaluateAction(payload.missionId, payload.intentId);
    }
  }
}
