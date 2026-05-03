import { IntentGap, EventBus } from '@intent/core';

export type Verdict = 'SATISFIED' | 'PARTIAL' | 'FAILED' | 'REGRESSED';

export class VerificationCourtAgent {
  constructor(private eventBus: EventBus) {}

  async evaluateGap(gap: IntentGap): Promise<Verdict> {
    // Fresh read from state (simulated)
    if (gap.gapScore === 0) return 'SATISFIED';
    if (gap.gapScore < 0.5) return 'PARTIAL';
    return 'FAILED';
  }

  async onMissionResult(payload: any) {
    // After mission result, trigger re-evaluation
    // In production, this would wait for a fresh sensor observation
    console.log(`VerificationCourt: Evaluating outcome of mission ${payload.missionId}`);
  }
}
