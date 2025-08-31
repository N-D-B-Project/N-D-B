import type { Redis } from "@nestjs-redis/client";
import type { QueueStoreManager, StoredQueue } from "lavalink-client";

export class QueueStore implements QueueStoreManager {
	public constructor(private readonly redis: Redis) {}

	public async get(guildId: string): Promise<string> {
		return (await this.redis.get(this.transformId(guildId))) as string;
	}

	public async set(
		guildId: string,
		value: string | StoredQueue,
	): Promise<boolean> {
		const result = await this.redis.set(
			this.transformId(guildId),
			value.toString(),
		);
		return Number(result) > 0;
	}

	public async delete(guildId: string): Promise<boolean> {
		const result = await this.redis.del(this.transformId(guildId));
		return Number(result) > 0;
	}

	async parse(
		stringifiedQueueData: StoredQueue | string,
	): Promise<Partial<StoredQueue>> {
		return JSON.parse(stringifiedQueueData.toString()) as Partial<StoredQueue>;
	}

	async stringify(
		parsedQueueData: StoredQueue | string,
	): Promise<StoredQueue | string> {
		return JSON.stringify(parsedQueueData);
	}

	private transformId(guildId: string): string {
		return `lavalink_queue:${guildId}`;
	}
}
