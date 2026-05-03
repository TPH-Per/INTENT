import { MicroMission, EventBus } from '@intent/core';

export class CommsAgent {
  constructor(private eventBus: EventBus) {}

  async onMissionDispatched(payload: { mission: MicroMission, agentId: string }) {
    if (payload.agentId !== 'comms-agent') return;
    if (payload.mission.type !== 'post_slack') return;

    console.log(`CommsAgent: Posting to Slack for mission ${payload.mission.id}`);
    
    await this.eventBus.emit('mission.result', {
      missionId: payload.mission.id,
      status: 'completed',
      output: { messageSent: true }
    });
  }
}
