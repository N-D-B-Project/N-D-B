import NDBClient from "@Client/NDBClient.js";
import { Logger } from "@Utils/Tools";
import * as Discord from "discord.js";
import * as Express from "express";
import router from "express-promise-router";
import { MapClass } from "../Middlewares";
import {
  GetShardsResponse,
  SetShardPresencesRequest,
  ShardInfo,
  ShardStats,
} from "../Models/Shards";
import { Controller } from "~/Types";

export default class ShardsController implements Controller {
  public path = "/shards";
  public router: Express.Router = router();
  public authToken: string = process.env.SCApi_Secret;
  private Logger: Logger = new Logger();

  public constructor(private shardManager: Discord.ShardingManager) {}

  public register(): void {
    this.router.get("/", (req, res) => this.getShards(req, res));
    this.router.put(
      "/presence",
      MapClass(SetShardPresencesRequest),
      (req, res) => this.setShardPresences(req, res)
    );
  }

  private async getShards(
    req: Express.Request,
    res: Express.Response
  ): Promise<void> {
    var shardDatas = await Promise.all(
      this.shardManager.shards.map(async (shard) => {
        var shardInfo: ShardInfo = {
          id: shard.id,
          ready: shard.ready,
          error: false,
        };

        try {
          const uptime = (await shard.fetchClientValue("uptime")) as number;
          shardInfo.uptimeSecs = Math.floor(uptime / 1000);
        } catch (error) {
          this.Logger.error(
            "Um erro ocorreu ao receber as informações do Shard",
            error
          );
          shardInfo.error = true;
        }

        return shardInfo;
      })
    );

    const stats: ShardStats = {
      shardCount: this.shardManager.shards.size,
      uptimeSecs: Math.floor(process.uptime()),
    };

    const resBody: GetShardsResponse = {
      shards: shardDatas,
      stats,
    };
    res.status(200).json(resBody);
  }

  private async setShardPresences(
    req: Express.Request,
    res: Express.Response
  ): Promise<void> {
    let reqBody: SetShardPresencesRequest = res.locals.input;

    await this.shardManager.broadcastEval(
      (client: NDBClient | any, context) => {
        return client.setPresence(context.type, context.name, context.url);
      },
      { context: { type: reqBody.type, name: reqBody.name, url: reqBody.url } }
    );

    res.sendStatus(200);
  }
}
