import { IntentGap, MissionDAG, LLMProvider, EventBus } from '@intent/core';

export class GapDecomposerAgent {
  constructor(
    private llm: LLMProvider,
    private eventBus: EventBus
  ) {}

  async onGapDetected(gap: IntentGap) {
    // 1. Call LLM to decompose gap into micro-mission DAG
    const dag = await this.llm.generateMissionDAG(gap);

    // 2. Emit mission.dispatched (actually mission.dag.created)
    await this.eventBus.emit('mission.dag.created', { gapId: gap.intentId, dag });
  }
}
