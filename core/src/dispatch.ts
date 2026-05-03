import { IntentGap } from './state';
import { EventBus } from './event_bus';

export interface MicroMission {
  id: string;
  type: string;
  requiredCapability: string;
  inputs: Record<string, any>;
  successCondition: string;
  status: 'pending' | 'dispatched' | 'completed' | 'failed';
}

export interface MissionDAG {
  missions: MicroMission[];
  dependencies: Record<string, string[]>; // missionId -> [dependentMissionIds]
}
