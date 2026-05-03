import { EventBus } from './event_bus';

export interface AuditEntry {
  orgId: string;
  actor: string;
  action: string;
  resource: any;
  result: 'success' | 'failure' | 'rollback';
  reason?: string;
  prev_hash: string | null;
}

export class AuditLog {
  private lastHash: string | null = null;

  constructor(private eventBus: EventBus) {}

  async log(entry: Omit<AuditEntry, 'prev_hash'>): Promise<string> {
    const timestamp = new Date();
    const id = crypto.randomUUID();
    
    const fullEntry: AuditEntry = {
      ...entry,
      prev_hash: this.lastHash,
    };

    // Compute row hash (simplified simulation of the SQL GENERATED ALWAYS AS logic)
    const rowContent = `${id}-${timestamp.toISOString()}-${entry.actor}-${entry.action}-${JSON.stringify(entry.resource)}`;
    const rowHash = Buffer.from(rowContent).toString('hex'); // In real SQL this is sha256
    
    this.lastHash = rowHash;

    console.log(`AuditLog: Logging action "${entry.action}" by ${entry.actor}`);
    
    // In production, this would be an INSERT into a Postgres table with REVOKE DELETE/UPDATE
    await this.eventBus.emit('security.audit.logged', { ...fullEntry, rowHash, timestamp });
    
    return rowHash;
  }
}
