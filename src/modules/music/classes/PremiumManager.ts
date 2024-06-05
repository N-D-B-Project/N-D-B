import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Client } from "discord.js";
import { BaseManager, QueueStore, RedisClient } from ".";

export class PremiumManager extends BaseManager {
	public constructor(client: Client, config: ConfigService, eventEmitter: EventEmitter2, redis: RedisClient) {
		super(client, config, eventEmitter, {
			clientOptions: { username: "Premium Player" },
			queueOptions: {
				maxPreviousTracks: 10,
				queueStore: new QueueStore(redis),
			},
			debugOptions: {
				noAudio: false,
			},
		});
	}
}
