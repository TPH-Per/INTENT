import { EventBus } from './event_bus';

export interface RollbackPlan {
  type: 'close_pr' | 'revert_config' | 'delete_file';
  targetId: string;
  data: any;
}

export class RollbackCoordinator {
  constructor(private eventBus: EventBus) {}

  async triggerRollback(plan: RollbackPlan, reason: string) {
    console.log(`Rollback: Triggering rollback for ${plan.targetId} due to: ${reason}`);
    
    // Simulate inverse action execution
    await this.eventBus.emit('rollback.executed', {
      plan,
      reason,
      timestamp: new Date(),
      status: 'SUCCESS'
    });

    // Re-emit gap to restart cycle
    await this.eventBus.emit('intent.gap.detected', {
      intentId: 'RETRY_NEEDED',
      gapScore: 1.0
    });
  }
}
