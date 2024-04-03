import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { PartialChannelData } from "discord.js";
import { GuildDTO } from "../guild/guild.dto";
import { DiscordHttpService } from "./discord-http.service";
import { IDiscordService } from "./interfaces/IDiscordService.interface";

@Injectable()
export class DiscordService implements IDiscordService {
	public constructor(@Inject(Services.Discord_HTTP) private readonly DiscordHttp: DiscordHttpService) {}

	public async getBotGuilds(): Promise<GuildDTO[]> {
		return (await this.DiscordHttp.fetchBotGuilds()).data;
	}

	public async getUserGuilds(accessToken: string): Promise<GuildDTO[]> {
		return (await this.DiscordHttp.fetchUserGuilds(accessToken)).data;
	}

	public async getMutualGuilds(accessToken: string): Promise<{
		mutual: {
			admin: GuildDTO[];
			owner: GuildDTO[];
		};
	}> {
		const bGuilds = await this.getBotGuilds();
		const uGuilds = await this.getUserGuilds(accessToken);

		const isUserAdmin = uGuilds.filter(({ permissions }) => (Number.parseInt(permissions) & 0x8) === 0x8);
		const isUserOwner = uGuilds.filter(({ owner }) => owner);

		const mutualAdminGuilds = isUserAdmin.filter(
			(guild: GuildDTO) => bGuilds.some((g: GuildDTO) => g.id === guild.id) && !guild.owner,
		);
		const mutualOwnerGuilds = isUserOwner.filter((guild) => bGuilds.some((g) => g.id !== guild.id));

		return {
			mutual: {
				admin: mutualAdminGuilds,
				owner: mutualOwnerGuilds,
			},
		};
	}

	public async getGuildChannels(guildId: string): Promise<AxiosResponse<PartialChannelData, unknown>> {
		return this.DiscordHttp.fetchGuildChannels(guildId);
	}
}
