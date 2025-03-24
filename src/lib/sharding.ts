import path from "node:path";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@/modules/config";
import { Logger } from "@nestjs/common";
import { ShardingManager as _ShardingManager } from "discord.js";

export class ShardingManager extends _ShardingManager {
	public constructor(private readonly configService: ConfigService) {
		super(path.join(__dirname, "bot.js"), {
			token: configService.get("Token"),
			shardList: "auto",
			respawn: true,
			mode: "process",
		});
	}

	private readonly logger = new Logger(ShardingManager.name);

	public async init() {
		this.spawn();

		this.on("shardCreate", (shard) => {
			shard.on("spawn", () => {
				this.logger.log(`Spawned shard: [${shard.id}]`);
			});

			shard.on("ready", () => {
				this.logger.log(`Shard [${shard.id}] is ready`);
			});

			shard.on("disconnect", () => {
				this.logger.error(`Shard [${shard.id}] disconnected`);
			});

			shard.on("reconnecting", () => {
				this.logger.warn(`Reconnecting shard: [${shard.id}]`);
			});

			shard.on("resume", () => {
				this.logger.log(`Shard [${shard.id}] resumed`);
			});

			shard.on("message", (message) => {
				if (this.configService.get("Debug").Shard) {
					this.logger.verbose(message);
				}
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
