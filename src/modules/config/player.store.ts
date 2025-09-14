import { BaseStore } from "@necord/lavalink";
import type { Redis } from "@nestjs-redis/client";
import type { PlayerJson } from "lavalink-client";

export class PlayerStore extends BaseStore {
	public constructor(readonly redis: Redis) {
		super();
	}

	public async save(key: string, value: string): Promise<void> {
		await this.redis.set(key, value);
		await this.redis.sAdd("players:keys", key);
	}

	public async delete(key: string): Promise<void> {
		await this.redis.del(key);
		await this.redis.sRem("players:keys", key);
	}

	public async get(key: string): Promise<PlayerJson | null> {
		const playerData = await this.redis.get(key);
		return playerData ? (JSON.parse(playerData as string) as PlayerJson) : null;
	}

	public async getAll(): Promise<{ key: string; value: string }[]> {
		const playerKeysSet = await this.redis.sMembers("players:keys");

		const playerKeys = Array.isArray(playerKeysSet)
			? playerKeysSet
			: Array.from(playerKeysSet);

		if (playerKeys.length === 0) {
			return [];
		}

		const values = await this.redis.mGet(playerKeys);

		return playerKeys.map((key, index) => ({
			key: key as string,
			value: values[index] as string,
		}));
	}
}
