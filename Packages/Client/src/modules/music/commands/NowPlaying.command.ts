import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Message } from "discord.js";
import { Music } from "../";
import { CommandContext } from "../../commands/Commands.context";
import { IMusicEmbeds, IMusicService } from "../interfaces";

@Injectable()
export class NowPlayingCommand {
	public constructor(
		@Inject(Music.Embeds) private readonly embeds: IMusicEmbeds,
		@Inject(Music.Service) private readonly service: IMusicService,
	) {}
	private readonly logger = new Logger(NowPlayingCommand.name);

	@LegacyCommand({
		name: "NowPlaying",
		aliases: ["nowplaying"],
		description: "",
		usage: "",
	})
	@SlashCommand({
		name: "now_playing",
		type: "Sub",
		deployMode: "Test",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext): Promise<Message> {
		if (!(await this.service.checkers(context))) {
			return;
		}

		const player = await this.service.getPlayer(context);

		return context.reply(await this.embeds.NowPlaying(context, player, await this.service.progressBar(player)));
	}
}
