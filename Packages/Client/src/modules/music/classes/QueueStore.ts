import { QueueStoreManager, StoredQueue } from "lavalink-client";
import { RedisClient } from "./RedisClient";

export class QueueStore implements QueueStoreManager {
	public constructor(private redis: RedisClient) {}

	public async get(guildId): Promise<string> {
		return await this.redis.get(this.id(guildId));
	}

	public async set(guildId, stringifiedQueueData): Promise<"OK"> {
		// await this.delete(guildId); // redis requires you to delete it first;
		return await this.redis.set(this.id(guildId), stringifiedQueueData);
	}

	public async delete(guildId): Promise<number> {
		return await this.redis.del(this.id(guildId));
	}

	public async parse(stringifiedQueueData): Promise<Partial<StoredQueue>> {
		return JSON.parse(stringifiedQueueData);
	}

	public async stringify(parsedQueueData): Promise<string> {
		return JSON.stringify(parsedQueueData);
	}

	private id(guildId: string): string {
		return `lavalinkqueue_${guildId}`;
	}
}
