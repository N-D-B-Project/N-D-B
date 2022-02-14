import * as Discord from "discord.js";
import { Logger } from "@Utils/Tools";
import { Config } from "../Config";
import { JobService } from "@APIs/SCApi/Services";

export default class ShardingClient {
  private readonly logger: Logger = new Logger();
  private config: typeof Config = Config;
  constructor(
    private ShardingManager: Discord.ShardingManager,
    private JobService: JobService
  ) {}

  public async start(): Promise<void> {
    this.registerEvents();
    this.ShardingManager.setMaxListeners(1);

    var ShardList = this.ShardingManager.shardList as number[];
    this.logger.info(`Spawning Shards: [${ShardList}]`);

    await this.ShardingManager.spawn({
      amount: this.ShardingManager.totalShards,
      delay: this.config.Sharding.spawnDelay * 1000,
      timeout: this.config.Sharding.spawnTimeout * 1000,
    });

    this.JobService.start();
  }

  private registerEvents(): void {
    this.ShardingManager.on("shardCreate", (shard) =>
      this.onShardCreate(shard)
    );
  }

  private onShardCreate(shard: Discord.Shard): void {
    this.logger.info(`Launching Shard #${shard.id.toString()}`);
  }
}
