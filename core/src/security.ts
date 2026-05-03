import { EventBus } from './event_bus';

export type Capability = 
  | 'INTENT_READ' 
  | 'CODE_WRITE' 
  | 'DOC_WRITE' 
  | 'OPS_READ' 
  | 'OPS_WRITE' 
  | 'OPS_PROD' 
  | 'COMMS_WRITE';

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'FAILURE' | 'PENDING';
  timestamp: Date;
  hashChain: string;
}

export class SecurityManager {
  private previousHash: string = '0';

  constructor(private eventBus: EventBus) {}

  async validateCapability(token: Capability[], required: Capability): Promise<boolean> {
    return token.includes(required);
  }

  async logAction(entry: Omit<AuditEntry, 'id' | 'timestamp' | 'hashChain'>) {
    const timestamp = new Date();
    const id = crypto.randomUUID();
    const hashChain = this.computeHash(id, timestamp, this.previousHash);
    
    const fullEntry: AuditEntry = { ...entry, id, timestamp, hashChain };
    this.previousHash = hashChain;

    console.log(`Security: Audit log entry created for ${entry.action}`);
    await this.eventBus.emit('security.audit.logged', fullEntry);
  }

  private computeHash(id: string, ts: Date, prev: string): string {
    // Simplified hash simulation
    return Buffer.from(`${id}-${ts.toISOString()}-${prev}`).toString('base64');
  }
}
