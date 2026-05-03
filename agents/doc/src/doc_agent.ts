import { MicroMission, EventBus } from '@intent/core';

export class DocAgent {
  constructor(private eventBus: EventBus) {}

  async onMissionDispatched(payload: { mission: MicroMission, agentId: string }) {
    if (payload.agentId !== 'doc-agent') return;
    if (payload.mission.type !== 'sync_docs') return;

    console.log(`DocAgent: Syncing documentation for mission ${payload.mission.id}`);
    
    await this.eventBus.emit('mission.result', {
      missionId: payload.mission.id,
      status: 'completed',
      output: { docsUpdated: true }
    });
  }
}
