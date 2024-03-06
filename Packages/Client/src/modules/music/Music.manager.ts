import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Client } from "discord.js";
import { CommonManager } from "./classes/CommonManager";
import "./classes/ExtendedPlayer";
import { PremiumManager } from "./classes/PremiumManager";
import { RedisClient } from "./classes/RedisClient";

@Injectable()
export class MusicManager implements OnModuleInit {
	public common: CommonManager;
	public premium: PremiumManager;
	public constructor(
		private readonly client: Client,
		private readonly config: ConfigService,
		private readonly eventEmitter: EventEmitter2,
	) {
		this.common = new CommonManager(client, config, eventEmitter);
		this.premium = new PremiumManager(client, config, eventEmitter, new RedisClient());
	}

	public async onModuleInit() {
		await this.common.load();
		await this.premium.load();
	}
}
