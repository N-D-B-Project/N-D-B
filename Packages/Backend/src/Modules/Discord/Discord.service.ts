import { Inject, Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { PartialChannelData } from "discord.js";
import { Services } from "src/@Types/Constants";
import { IDiscord, IDiscordHttp } from "src/@Types/IServices";

@Injectable()
export class DiscordService implements IDiscord {
  constructor(
    @Inject(Services.DISCORD_HTTP) private readonly DiscordHttp: IDiscordHttp
  ) {}

  public async getBotGuilds() {
    return (await this.DiscordHttp.fetchBotGuilds()).data;
  }

  public async getUserGuilds(accessToken: string) {
    return (await this.DiscordHttp.fetchUserGuilds(accessToken)).data;
  }

  public async getMutualGuilds(accessToken: string) {
    const bGuilds = await this.getBotGuilds();
    const uGuilds = await this.getUserGuilds(accessToken);

    const isUserAdmin = uGuilds.filter(
      ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
    );
    const isUserOwner = uGuilds.filter(({ owner }) => owner);

    const mutualAdminGuilds = isUserAdmin.filter(
      guild => bGuilds.some(g => g.id === guild.id) && !guild.owner
    );
    const mutualOwnerGuilds = isUserOwner.filter(guild =>
      bGuilds.some(g => g.id !== guild.id)
    );

    return {
      mutual: {
        admin: mutualAdminGuilds,
        owner: mutualOwnerGuilds
      }
    };
  }

  public async getGuildChannels(
    guildId: string
  ): Promise<AxiosResponse<PartialChannelData[], any>> {
    return await this.DiscordHttp.fetchGuildChannels(guildId);
  }
}
