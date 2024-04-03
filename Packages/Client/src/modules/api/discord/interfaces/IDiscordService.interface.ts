import { AxiosResponse } from "axios";
import { PartialChannelData } from "discord.js";
import { GuildDTO } from "../../guild/guild.dto";

export interface IDiscordService {
	getBotGuilds(): Promise<GuildDTO[]>;
	getUserGuilds(accessToken: string): Promise<GuildDTO[]>;
	getMutualGuilds(accessToken: string): Promise<{
		mutual: {
			admin: GuildDTO[];
			owner: GuildDTO[];
		};
	}>;
	getGuildChannels(guildId: string): Promise<AxiosResponse<PartialChannelData, unknown>>;
}
