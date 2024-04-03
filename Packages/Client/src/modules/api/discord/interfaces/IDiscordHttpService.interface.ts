import { AxiosResponse } from "axios";
import { PartialChannelData } from "discord.js";
import { GuildDTO } from "../../guild/guild.dto";

export interface IDiscordHttpService {
	fetchBotGuilds(): Promise<AxiosResponse<GuildDTO[], unknown>>;
	fetchUserGuilds(accessToken: string): Promise<AxiosResponse<GuildDTO[], unknown>>;
	fetchGuildChannels(guildId: string): Promise<AxiosResponse<PartialChannelData, unknown>>;
}
