import { InjectRedis, type Redis } from "@nestjs-redis/client";
import { Injectable } from "@nestjs/common";
import type { Player, PlayerJson } from "lavalink-client";

@Injectable()
export class PlayerSaver {
	public constructor(@InjectRedis() private readonly redis: Redis) {}

	public async savePlayerOnUpdate(
		oldPlayer: PlayerJson,
		newPlayer: Player,
	): Promise<void> {
		const newPlayerData = newPlayer.toJSON();

		if (
			!oldPlayer ||
			oldPlayer.voiceChannelId !== newPlayerData.voiceChannelId ||
			oldPlayer.textChannelId !== newPlayerData.textChannelId ||
			oldPlayer.options.selfDeaf !== newPlayerData.options.selfDeaf ||
			oldPlayer.options.selfMute !== newPlayerData.options.selfMute ||
			oldPlayer.nodeId !== newPlayerData.nodeId ||
			oldPlayer.nodeSessionId !== newPlayerData.nodeSessionId ||
			oldPlayer.options.applyVolumeAsFilter !==
				newPlayerData.options.applyVolumeAsFilter ||
			oldPlayer.options.instaUpdateFiltersFix !==
				newPlayerData.options.instaUpdateFiltersFix ||
			oldPlayer.options.vcRegion !== newPlayerData.options.vcRegion
		) {
			const id = this.transformId(newPlayerData.guildId);
			await this.redis.set(id, JSON.stringify(newPlayerData));
			await this.redis.sAdd("players:keys", id);
		}
	}

	public async savePlayerOnCreate(player: Player): Promise<void> {
		const playerData = player.toJSON();
		const id = this.transformId(playerData.guildId);
		await this.redis.set(id, JSON.stringify(playerData));
		await this.redis.sAdd("players:keys", id);
	}

	public async getSessions(): Promise<Map<string, string>> {
		const sessions = new Map<string, string>();

		try {
			const players = await this.getAllPlayers();

			if (players.length === 0) return new Map();

			for (const player of players) {
				if (player.value) {
					const rawValue = Buffer.isBuffer(player.value)
						? player.value.toString("utf-8")
						: player.value;

					const playerObj = JSON.parse(rawValue) as PlayerJson;

					if (playerObj.nodeSessionId && playerObj.nodeId) {
						sessions.set(playerObj.nodeId, playerObj.nodeSessionId);
					}
				}
			}

			return sessions;
		} catch (error) {
			return new Map();
		}
	}

	public async getAllPlayers() {
		const playerKeysSet = await this.redis.sMembers("players:keys");

		const playerKeys = Array.isArray(playerKeysSet)
			? playerKeysSet
			: Array.from(playerKeysSet);

		if (playerKeys.length === 0) {
			return [];
		}

		const values = await this.redis.mGet(playerKeys);

		return playerKeys.map((key, index) => ({
			key,
			value: values[index],
		}));
	}

	public async getPlayer(guildId: string): Promise<PlayerJson | null> {
		const playerData = await this.redis.get(this.transformId(guildId));
		return playerData ? (JSON.parse(playerData as string) as PlayerJson) : null;
	}

	public async deletePlayer(guildId: string): Promise<void> {
		await this.redis.del(this.transformId(guildId));
	}

	private transformId(guildId: string): string {
		return `player:${guildId}`;
	}
}
