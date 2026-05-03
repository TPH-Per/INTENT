import { MicroMission, MissionDAG, EventBus } from '@intent/core';

export interface AgentCapability {
  agentId: string;
  type: string;
  capabilities: string[];
  successRate: number;
  currentLoad: number;
  circuitState: 'CLOSED' | 'OPEN' | 'HALF-OPEN';
  failures: number;
}

export class DispatcherAgent {
  private acr: AgentCapability[] = [];
  private readonly FAILURE_THRESHOLD = 3;

  constructor(private eventBus: EventBus) {}

  registerAgent(capability: AgentCapability) {
    this.acr.push({ ...capability, circuitState: 'CLOSED', failures: 0 });
  }

  async onMissionDispatched(missionId: string, success: boolean) {
    // Simulated feedback loop from Verification Court or Agent Result
    const mission = missionId; // Map to agent
    const agent = this.acr.find(a => a.agentId === 'TODO'); // Real mapping needed
    if (!agent) return;

    if (success) {
      agent.failures = 0;
      agent.circuitState = 'CLOSED';
    } else {
      agent.failures++;
      if (agent.failures >= this.FAILURE_THRESHOLD) {
        agent.circuitState = 'OPEN';
        console.warn(`Circuit OPEN for agent ${agent.agentId}`);
        await this.eventBus.emit('circuit.open', { agentId: agent.agentId });
      }
    }
  }

  async onDagCreated(payload: { gapId: string, dag: MissionDAG }) {
    const { dag } = payload;
    
    for (const mission of dag.missions) {
      if (mission.status === 'pending') {
        const agent = this.acr.find(a => 
          a.capabilities.includes(mission.requiredCapability) &&
          a.circuitState !== 'OPEN'
        );

        if (agent) {
          mission.status = 'dispatched';
          await this.eventBus.emit('mission.dispatched', {
            mission,
            agentId: agent.agentId
          });
        } else {
          console.error(`No healthy agent found for capability: ${mission.requiredCapability}`);
          // Escalate or queue for later
        }
      }
    }
  }
}
