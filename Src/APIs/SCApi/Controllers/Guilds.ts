import * as Discord from "discord.js";
import * as Express from "express";
import router from "express-promise-router";

import { GetGuildsResponse } from "../Models/Guilds";
import { Controller } from "~/Types";

export default class GuildsController implements Controller {
  public path = "/guilds";
  public router: Express.Router = router();
  public authToken: string = process.env.SCApi_Secret;

  constructor(private shardManager: Discord.ShardingManager) {}

  public register(): void {
    this.router.get("/", (req, res) => this.getGuilds(req, res));
  }

  private async getGuilds(
    req: Express.Request,
    res: Express.Response
  ): Promise<void> {
    let guilds: string[] = [
      ...new Set(
        (
          await this.shardManager.broadcastEval((client) => [
            ...client.guilds.cache.keys(),
          ])
        ).flat()
      ),
    ];

    let resBody: GetGuildsResponse = {
      guilds,
    };
    res.status(200).json(resBody);
  }
}
