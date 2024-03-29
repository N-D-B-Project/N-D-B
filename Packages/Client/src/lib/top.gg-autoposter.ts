import { Logger } from "@nestjs/common";
import { DJSSharderPoster } from "topgg-autoposter";
import { ShardingManager } from "./";

export class TopGGAutoPoster extends DJSSharderPoster {
	public constructor(
		private readonly token: string,
		shardManager: ShardingManager,
	) {
		super(token, shardManager, {
			startPosting: false,
			postOnStart: true,
			interval: 36 * 100 * 1000, // 1 Hour
		});
	}

	private readonly logger = new Logger(TopGGAutoPoster.name);

	public async init() {
		this.start();
		if (this.started) {
			this.logger.log("Started");
		}
		this.on("posted", (stats) => {
			this.logger.log(`Posted stats to Top.gg | ${stats.serverCount} Server(s) | ${stats.shardCount} Shard(s)`);
		}).on("error", (error) => {
			this.logger.error(`Error when posting stats: ${error}`);
		});
	}
}
