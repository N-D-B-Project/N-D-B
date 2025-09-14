import type { Redis } from "@nestjs-redis/client";
import type { QueueStoreManager, StoredQueue } from "lavalink-client";

export class QueueStore implements QueueStoreManager {
	public constructor(private readonly redis: Redis) {}

	public async get(guildId: string): Promise<string> {
		const data = (await this.redis.get(this.transformId(guildId))) as string;
		return data;
	}

	public async set(guildId: string, stringifiedQueueData): Promise<boolean> {
		const result = await this.redis.set(
			this.transformId(guildId),
			stringifiedQueueData,
		);
		return Number(result) > 0;
	}

	public async delete(guildId: string): Promise<boolean> {
		const result = await this.redis.del(this.transformId(guildId));
		return Number(result) > 0;
	}

	public async parse(stringifiedQueueData): Promise<Partial<StoredQueue>> {
		return typeof stringifiedQueueData === "string"
			? JSON.parse(stringifiedQueueData)
			: stringifiedQueueData;
	}

	public async stringify(parsedQueueData): Promise<StoredQueue | string> {
		return typeof parsedQueueData === "object"
			? JSON.stringify(parsedQueueData)
			: parsedQueueData;
	}

	private transformId(guildId: string): string {
		return `lavalink_queue:${guildId}`;
	}
}
