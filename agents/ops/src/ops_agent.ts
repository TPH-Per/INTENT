import { MicroMission, EventBus } from '@intent/core';

export class OpsAgent {
  constructor(private eventBus: EventBus) {}

  async onMissionDispatched(payload: { mission: MicroMission, agentId: string }) {
    if (payload.agentId !== 'ops-agent') return;
    if (payload.mission.type !== 'scale_service') return;

    console.log(`OpsAgent: Scaling service for mission ${payload.mission.id}`);
    
    await this.eventBus.emit('mission.result', {
      missionId: payload.mission.id,
      status: 'completed',
      output: { replicas: 3 }
    });
  }
}
