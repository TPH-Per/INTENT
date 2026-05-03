import Redis from 'ioredis';

export interface EventBusConfig {
  redisUrl: string;
}

export class EventBus {
  private redis: Redis;

  constructor(config: EventBusConfig) {
    this.redis = new Redis(config.redisUrl);
  }

  async emit(stream: string, payload: any): Promise<string> {
    const id = await this.redis.xadd(stream, '*', 'data', JSON.stringify(payload));
    return id as string;
  }

  async subscribe(stream: string, group: string, consumer: string, callback: (payload: any) => Promise<void>) {
    const dlqStream = `${stream}.DLQ`;
    try {
      await this.redis.xgroup('CREATE', stream, group, '$', 'MKSTREAM');
    } catch (e: any) {
      if (!e.message.includes('BUSYGROUP')) throw e;
    }

    while (true) {
      const results = await this.redis.xreadgroup('GROUP', group, consumer, 'BLOCK', 5000, 'COUNT', 1, 'STREAMS', stream, '>');
      if (results) {
        for (const [streamName, messages] of results) {
          for (const [id, [_, data]] of messages) {
            try {
              const payload = JSON.parse(data);
              // Deduplication logic could go here using id or a payload hash
              await callback(payload);
              await this.redis.xack(streamName, group, id);
            } catch (error) {
              console.error(`Error processing message ${id} from ${streamName}:`, error);
              // Move to DLQ after 3 attempts (simulated with basic push here)
              await this.redis.xadd(dlqStream, '*', 'original_id', id, 'error', String(error), 'data', data);
              // Acknowledge the original so we don't get stuck, but it's in DLQ
              await this.redis.xack(streamName, group, id);
            }
          }
        }
      }
    }
  }

  async disconnect() {
    await this.redis.quit();
  }
}
