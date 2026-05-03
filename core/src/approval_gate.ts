import { EventBus } from '@intent/core';

export interface ApprovalRequest {
  id: string;
  actionId: string;
  agentType: string;
  actionDescription: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  proposedAction: object;
  rollbackPlan: object;
  expiresAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

export class HumanApprovalGate {
  constructor(private eventBus: EventBus) {}

  async requiresApproval(capability: string): Promise<boolean> {
    const highRiskCapabilities = ['OPS_PROD', 'OPS_WRITE_PROD', 'CODE_WRITE_PROD'];
    return highRiskCapabilities.includes(capability);
  }

  async createApprovalRequest(action: any): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      id: crypto.randomUUID(),
      actionId: action.id,
      agentType: action.agentType,
      actionDescription: action.description,
      riskLevel: 'high', // Assessment logic here
      proposedAction: action.payload,
      rollbackPlan: action.rollbackPlan,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      status: 'pending',
    };

    console.log(`ApprovalGate: Created request ${request.id} for action ${action.description}`);
    
    // In production, persist to DB and notify via Slack/WebSocket
    await this.eventBus.emit('approval.requested', request);
    
    return request;
  }

  async waitForApproval(requestId: string): Promise<boolean> {
    const maxWait = 30 * 60 * 1000;
    const pollInterval = 10_000;
    const start = Date.now();

    console.log(`ApprovalGate: Waiting for approval on ${requestId}...`);

    while (Date.now() - start < maxWait) {
      // In production, this would check a DB or subscribe to a 'decision' event
      // Here we simulate the logic
      
      // Simulate checking for status (mocked check)
      const status: 'pending' | 'approved' | 'rejected' = 'approved'; // Mocked for simulation
      
      if (status === 'approved') return true;
      if (status === 'rejected') return false;

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    return false;
  }
}
