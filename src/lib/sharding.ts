import path from "node:path";
import { Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { metrics, trace } from "@opentelemetry/api";
import { ShardingManager as _ShardingManager } from "discord.js";

export class ShardingManager extends _ShardingManager {
	private readonly meter = metrics.getMeter("necord-bot");
	private readonly messageCounter = this.meter.createCounter(
		"messages_processed",
		{
			description: "Número de mensagens processadas pelo bot",
		},
	);

	public constructor(
		private readonly config: ConfigService,
		withHRM: boolean,
	) {
		super(path.join(__dirname, withHRM ? "lib" : "", "bot.js"), {
			token: config.getOrThrow("Discord").Token,
			shardList: "auto",
			respawn: true,
			mode: "process",
		});
	}

	private readonly logger = new Logger(ShardingManager.name);

	public async init() {
		this.spawn();

		this.on("shardCreate", (shard) => {
			const tracer = trace.getTracer("necord-bot");
			const shardId = shard.id;
			const createSpan = (
				name: string,
				attributes: Record<string, any> = {},
			) => {
				const span = tracer.startSpan(name, {
					attributes: { shardId, ...attributes },
				});
				span.end();
			};

			shard.on("spawn", () => {
				createSpan("shard_spawn");
				this.logger.log(`Spawned shard: [${shard.id}]`);
			});

			shard.on("ready", () => {
				createSpan("shard_ready");
				this.logger.log(`Shard [${shard.id}] is ready`);
			});

			shard.on("disconnect", () => {
				createSpan("shard_disconnect");
				this.logger.error(`Shard [${shard.id}] disconnected`);
			});

			shard.on("reconnecting", () => {
				createSpan("shard_reconnecting");
				this.logger.warn(`Reconnecting shard: [${shard.id}]`);
			});

			shard.on("resume", () => {
				createSpan("shard_resume");
				this.logger.log(`Shard [${shard.id}] resumed`);
			});

			shard.on("message", (message) => {
				const span = tracer.startSpan("shard_message", {
					attributes: {
						shardId,
						channelId: message?.channelId,
						authorId: message?.author?.id,
						contentSnippet: message?.content?.slice(0, 50),
					},
				});
				try {
					this.messageCounter.add(1, { shardId });
					if (this.config.getOrThrow("Debug").Shard)
						this.logger.verbose(message);
				} finally {
					span.end();
				}
			});

			shard.on("death", () => {
				createSpan("shard_death");
				this.logger.fatal(`Died shard: [${shard.id}]`);
			});

			shard.on("error", (err) => {
				createSpan("shard_error", { error: (err as Error).message });
				this.logger.error(`Error in shard [${shard.id}] with : ${err} `);
				shard.respawn();
			});
		});
	}
}
