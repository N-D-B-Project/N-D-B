import "dotenv/config";
import "reflect-metadata";
import * as Discord from "discord.js";
import ShardingClient from "@Client/ShardingClient";
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

async function Start(): Promise<void> {
  const _HttpService = new HttpService();
  const _RootService = new RootService(_HttpService);
  const _ClusterService = new ClusterService(_HttpService);
  const _JobService = new JobService([new UpdateClusterCache(_ClusterService)]);

  const _Root = new RootController();
  const _Cluster = new ClustersController();
  const ClusterAPI = new SCApi([_Root, _Cluster], 1);
  await ClusterAPI.start();

  if (Config.Sharding.enable) {
    await _RootService.Register();
    // .catch((error: Error) => {
    //   logger.error(`Root Register Error: ${error.stack}`);
    // });
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

  const ShardingConfig = new Discord.ShardingManager("Dist/Root.js", {
    token: process.env.Token,
    mode: "worker",
    respawn: true,
    totalShards,
    shardList,
  });

  const _Guilds = new GuildsController(ShardingConfig);
  const _Shards = new ShardsController(ShardingConfig);

  const ShardAPI = new SCApi([_Root, _Guilds, _Shards], 2);
  const ShardingManager = new ShardingClient(ShardingConfig);

  try {
    await ShardingManager.start();

    await ShardAPI.start();
    _JobService.start();
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
