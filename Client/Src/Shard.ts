import "dotenv/config";
import "reflect-metadata";
import { ShardingManager as ShardManager } from "discord.js";
import AutoPoster from "topgg-autoposter";
import ShardingClient from "@Client/ShardingClient";
import util from "node:util";
import SCApi from "@APIs/SCApi/Api";
import {
  HttpService,
  RootService,
  JobService,
  ClusterService,
} from "@APIs/SCApi/Services";
import {
  RootController,
  ClustersController,
  ShardsController,
  GuildsController,
} from "@APIs/SCApi/Controllers";
import UpdateClusterCache from "@APIs/SCApi/Jobs/UpdateClusterCache";
import { Config } from "~/Config";
import { MathTools, Sharding, Logger } from "@Utils/Tools";
const logger: Logger = new Logger();
const Wait = util.promisify(setTimeout);

async function Start(): Promise<void> {
  const _HttpService = new HttpService();
  const _RootService = new RootService(_HttpService);
  const _ClusterService = new ClusterService(_HttpService);
  const _JobService = new JobService([new UpdateClusterCache(_ClusterService)]);

  const _Root = new RootController();
  const _Cluster = new ClustersController();
  const ClusterAPI = new SCApi([_Root, _Cluster], 1);
  await ClusterAPI.start();

  await Wait(2000);

  if (Config.Sharding.enable) {
    await _RootService.Register().catch((error: Error) => {
      logger.error(`Root Register Error: ${error.stack}`);
    });
  }

  var shardList: number[];
  var totalShards: number;

  try {
    if (Config.Sharding.enable) {
      const resBody = await _RootService.Login();
      shardList = resBody.shardList;
      const requiredShards = await Sharding.requiredShardCount(
        process.env.Token
      );
      totalShards = Math.max(requiredShards, resBody.totalShards);
    } else {
      const recommendedShards = await Sharding.recommendedShardCount(
        process.env.Token,
        Config.Sharding.serversPerShard
      );
      shardList = MathTools.range(0, recommendedShards);
      totalShards = recommendedShards;
    }
  } catch (error) {
    logger.error(`Creating Shards Config Error: ${error}`);
  }

  if (shardList.length === 0) {
    logger.warn("No shards to spawn");
    return;
  }

  const ShardingConfig = new ShardManager("Dist/Root.js", {
    token: process.env.Token,
    mode: "worker",
    respawn: true,
    totalShards,
    shardList,
  });

  const TopGG_Poster = AutoPoster(process.env.TopGG_Token, ShardingConfig)
    .on("error", (error: Error) => {
      logger.error(`TopGG Poster Error: ${error}`);
    })
    .on("posted", () => {
      logger.info("Posted stats to Top.GG");
    });
  const _Guilds = new GuildsController(ShardingConfig);
  const _Shards = new ShardsController(ShardingConfig);

  const ShardAPI = new SCApi([_Root, _Guilds, _Shards], 2);
  const ShardingManager = new ShardingClient(ShardingConfig, _JobService);

  try {
    await ShardingManager.start();
    await ShardAPI.start();
    if (Config.Sharding.enable) {
      await _RootService.ready();
    }
  } catch (error) {
    logger.error(`Starting APIs Error: ${error}`);
  }
}

Start().catch((error: Error) => {
  logger.error(`Start Sharding Error: ${error.stack}`);
});
