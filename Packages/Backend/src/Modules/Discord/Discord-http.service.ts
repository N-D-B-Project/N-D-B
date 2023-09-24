import { Injectable } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";
import { PartialChannelData } from "discord.js";
import { PartialGuild } from "src/@Types";
import { DiscordAPIUrl } from "src/@Types/Constants";
import { IDiscordHttp } from "src/@Types/IServices";

@Injectable()
export class DiscordHttpService implements IDiscordHttp {
  fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[], any>> {
    return axios.get(`${DiscordAPIUrl}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${process.env.DToken}`
      }
    });
  }
  fetchUserGuilds(
    accessToken: string
  ): Promise<AxiosResponse<PartialGuild[], any>> {
    return axios.get(`${DiscordAPIUrl}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
  fetchGuildChannels(
    guildId: string
  ): Promise<AxiosResponse<PartialChannelData[], any>> {
    return axios.get(`${DiscordAPIUrl}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${process.env.DToken}`
      }
    });
  }
}
