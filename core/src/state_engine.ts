import { FIS, StateObservation, IntentGap, EventBus } from '@intent/core';

export interface IntentStore {
  getActiveIntents(): Promise<FIS[]>;
}

export class SemanticStateEngineAgent {
  constructor(
    private intentStore: IntentStore,
    private eventBus: EventBus
  ) {}

  async onObservation(observation: StateObservation) {
    // 1. Semantic match: which intents does this relate to?
    const intents = await this.intentStore.getActiveIntents();
    const relevantIntents = intents.filter(intent => 
      this.isRelevant(intent, observation)
    );

    for (const intent of relevantIntents) {
      // 2. Compute delta
      const gaps = this.computeGaps(intent, observation);
      
      for (const gap of gaps) {
        if (gap.gapScore > 0) {
          // 3. Emit intent.gap.detected
          await this.eventBus.emit('intent.gap.detected', gap);
        }
      }
    }
  }

  private isRelevant(intent: FIS, observation: StateObservation): boolean {
    // Basic rule-based scope filter for now
    // In production, this would use embedding similarity
    return intent.criteria.some(c => c.sensorType === observation.type);
  }

  private computeGaps(intent: FIS, observation: StateObservation): IntentGap[] {
    const gaps: IntentGap[] = [];
    
    for (const criterion of intent.criteria) {
      if (criterion.sensorType === observation.type) {
        const targetValue = intent.thresholds[criterion.id];
        const currentValue = observation.value;
        
        // Simple numeric comparison for gap score
        let gapScore = 0;
        if (typeof currentValue === 'number' && typeof targetValue === 'number') {
          if (currentValue > targetValue) {
            gapScore = (currentValue - targetValue) / (targetValue || 1);
          }
        } else if (currentValue !== targetValue) {
          gapScore = 1.0;
        }

        gaps.push({
          intentId: intent.id,
          criterionId: criterion.id,
          currentValue,
          targetValue,
          gapScore: Math.min(gapScore, 1.0),
          timestamp: new Date()
        });
      }
    }
    
    return gaps;
  }
}
