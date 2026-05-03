import { MicroMission, EventBus } from '@intent/core';

export class CodeAgent {
  constructor(private eventBus: EventBus) {}

  async onMissionDispatched(payload: { mission: MicroMission, agentId: string }) {
    if (payload.agentId !== 'code-agent') return;
    if (payload.mission.type !== 'write_fix') return;

    console.log(`CodeAgent: Writing fix for mission ${payload.mission.id}`);
    
    // In production, this would use semantic code search and LLM to generate fix
    // and then open a PR.
    
    await this.eventBus.emit('mission.result', {
      missionId: payload.mission.id,
      status: 'completed',
      output: { prUrl: 'https://github.com/org/repo/pull/1' }
    });
  }
}
