import { IntentStore } from '@intent/core';
import { FISModel } from './models';
import { FIS } from '@intent/core';

export class PostgresIntentStore implements IntentStore {
  async getActiveIntents(): Promise<FIS[]> {
    const models = await FISModel.findAll({ where: { status: 'active' } });
    return models.map(m => m.toJSON() as FIS);
  }
}
