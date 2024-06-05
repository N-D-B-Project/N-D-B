import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Client } from "discord.js";
import { BaseManager } from ".";

export class CommonManager extends BaseManager {
	public constructor(client: Client, config: ConfigService, eventEmitter: EventEmitter2) {
		super(client, config, eventEmitter, {
			clientOptions: { username: "Common Player" },
			queueOptions: { maxPreviousTracks: 1 },
		});
	}
}
