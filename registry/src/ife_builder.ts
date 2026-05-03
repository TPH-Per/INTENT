import { FIS, EventBus, LLMProvider } from '@intent/core';
import { FISModel } from './models';
import { ConflictDetectorAgent } from './conflict_detector';

export class IFEBuilderAgent {
  constructor(
    private llm: LLMProvider,
    private conflictDetector: ConflictDetectorAgent,
    private eventBus: EventBus
  ) {}

  async registerIntent(nl: string): Promise<FIS> {
    // 1. Extract FIS from NL using LLM
    const fis = await this.llm.generateFIS(nl);

    // 2. Run Conflict Detection
    const { conflicts, safe_to_register } = await this.conflictDetector.checkConflicts(fis);

    if (!safe_to_register) {
      throw new Error(`Intent conflicts detected: ${conflicts.join(', ')}`);
    }

    // 3. Persist FIS to Postgres
    await FISModel.create(fis as any);

    // 4. Emit intent.registered event
    await this.eventBus.emit('intent.registered', fis);

    return fis;
  }
}
