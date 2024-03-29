import path from "node:path";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ShardingManager as _ShardingManager } from "discord.js";
import { Config } from "../modules/config/types";

export class ShardingManager extends _ShardingManager {
	public constructor(private readonly config: ConfigService) {
		super(path.join(__dirname, "bot.js"), {
			token: config.getOrThrow<Config["Discord"]>("Discord").Token,
			shardList: "auto",
			respawn: true,
			mode: "process",
		});
	}

	private readonly logger = new Logger(ShardingManager.name);

	public async init() {
		this.spawn();

		this.on("shardCreate", (shard) => {
			shard.on("reconnecting", () => {
				this.logger.warn(`Reconnecting shard: [${shard.id}]`);
			});

			shard.on("spawn", () => {
				this.logger.log(`Spawned shard: [${shard.id}]`);
			});

			shard.on("ready", () => {
				this.logger.log(`Shard [${shard.id}] is ready`);
			});

			shard.on("death", () => {
				this.logger.fatal(`Died shard: [${shard.id}]`);
			});

			shard.on("error", (err) => {
				this.logger.error(`Error in shard [${shard.id}] with : ${err} `);
				shard.respawn();
			});
		});
	}
}
