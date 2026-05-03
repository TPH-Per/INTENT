import { EventBus, StateObservation } from '@intent/core';

export class SensorMeshAgent {
  constructor(private eventBus: EventBus) {}

  async emitObservation(observation: StateObservation) {
    await this.eventBus.emit('sensor.observation', observation);
  }
}
