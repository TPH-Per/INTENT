import { EventBus } from '@intent/core';

export interface ApprovalRequest {
  id: string;
  intentId: string;
  action: any;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestedBy: string;
  expiresAt: Date;
}

export class ApprovalGate {
  constructor(private eventBus: EventBus) {}

  async requestApproval(request: Omit<ApprovalRequest, 'status' | 'expiresAt'>): Promise<string> {
    const fullRequest: ApprovalRequest = {
      ...request,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins expiry
    };

    console.log(`ApprovalGate: Requesting approval for action on intent ${request.intentId}`);
    await this.eventBus.emit('approval.requested', fullRequest);
    return fullRequest.id;
  }

  async handleDecision(id: string, verdict: 'APPROVED' | 'REJECTED', approver: string) {
    // In production, this would update a database and emit a decision event
    console.log(`ApprovalGate: Decision for ${id} is ${verdict} by ${approver}`);
    await this.eventBus.emit('approval.decided', { id, verdict, approver, timestamp: new Date() });
  }
}
