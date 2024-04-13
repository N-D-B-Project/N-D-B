import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Music } from "../";
import { CommandContext } from "../../commands/Commands.context";
import type { IMusicService } from "../interfaces";

@Injectable()
export class StopCommand {
	public constructor(
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
	) {}

	private readonly logger = new Logger(StopCommand.name);

	@LegacyCommand({
		name: "stop",
		aliases: ["Stop"],
		description: "Stops the music queue",
		usage: "",
	})
	@SlashCommand({
		name: "stop",
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
	public async onCommandRun([client, context]: CommandContext) {
		const player = await this.service.getPlayer(context);
		if (!(await this.service.checkers(context))) return;
		await player.destroy();
		return context.reply(this.translate.getTranslation("Tools/Music:Stop", context.guild.preferredLocale));
	}
}
