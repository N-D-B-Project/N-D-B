import { AxiosResponse } from "axios";
import { PartialChannelData } from "discord.js";
import { PartialGuild, userInfo } from ".";

export interface IAuth {
  validateUser(details: userInfo);
}

export interface IUser {
  createUser(details: userInfo);
  getUser(userId: string);
  updateUser(details: userInfo);
}

export interface IDiscord {
  getBotGuilds();
  getUserGuilds(accessToken: string);
  getMutualGuilds(accessToken: string, userId: string);
  getGuildChannels(
    guildId: string
  ): Promise<AxiosResponse<PartialChannelData[]>>;
}

export interface IDiscordHttp {
  fetchBotGuilds(): Promise<AxiosResponse<PartialGuild[]>>;
  fetchUserGuilds(accessToken: string): Promise<AxiosResponse<PartialGuild[]>>;
  fetchGuildChannels(
    guildId: string
  ): Promise<AxiosResponse<PartialChannelData[]>>;
}
