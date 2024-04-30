import type { IDatabaseService } from "@/modules/SharedModule/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { Client } from "discord.js";
import { Context, ContextOf, On } from "necord";
import type { IMusicService } from "../interfaces";
import { Music } from "../types/constants";

@Injectable()
export class GuildEvents {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(Music.Service) private readonly MusicService: IMusicService,
		private readonly client: Client,
	) {}

	@On("guildDelete")
	public async onGuildDelete(@Context() [guild]: ContextOf<"guildDelete">) {
		const guildRepo = this.database.GuildRepo();
		const { Premium } = (await guildRepo.get(guild.id)).Settings;
		(await this.MusicService.getPlayerEvent(guild.id, Premium)).destroy("Guild has deleted");
	}

	@On("guildMemberRemove")
	public async onGuildMemberRemove(@Context() [member]: ContextOf<"guildMemberRemove">) {
		if (member.id === this.client.user.id) {
			const guildRepo = this.database.GuildRepo();
			const { Premium } = (await guildRepo.get(member.guild.id)).Settings;
			await (await this.MusicService.getPlayerEvent(member.guild.id, Premium)).destroy("Removed from guild");
		}
	}
}
