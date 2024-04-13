import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Message } from "discord.js";
import { Music } from "../";
import { CommandContext } from "../../commands/Commands.context";
import type { IMusicService } from "../interfaces";

@Injectable()
export class PauseCommand {
	public constructor(
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
	) {}

	private readonly logger = new Logger(PauseCommand.name);

	@LegacyCommand({
		name: "pause",
		aliases: ["Pause"],
		description: "Pauses the music Queue",
		usage: "",
	})
	@SlashCommand({
		name: "pause",
		type: "Sub",
		deployMode: "Test",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["SendMessages"],
		user: ["SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext): Promise<Message> {
		const player = await this.service.getPlayer(context);
		if (!(await this.service.checkers(context))) return;
		await player.pause();
		return context.reply(this.translate.getTranslation("Tools/Music:Pause", context.guild.preferredLocale));
	}
}
