import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import {
  CurrentTranslate,
  LOCALIZATION_ADAPTER,
  localizationMapByKey,
  type NestedLocalizationAdapter,
  type TranslationFn,
} from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Ctx, Subcommand, type SlashCommandContext } from "necord";
import { Music } from "..";
import { MusicCommand } from "../Music.decorator";
import type { IMusicService } from "../interfaces";

@MusicCommand()
export class PauseCommand {
	public constructor(
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
	) {}

	private readonly logger = new Logger(PauseCommand.name);

	@Subcommand({
		name: "pause",
		description: "Pauses the music queue",
		nameLocalizations: localizationMapByKey("Music.pause.name"),
		descriptionLocalizations: localizationMapByKey("Music.pause.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: ["SendMessages"],
		user: ["SendMessages"],
		guildOnly: false,testOnly: true,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const player = await this.service.getPlayer(interaction);
		if (!(await this.service.checkers(interaction))) return;
		await player.pause();
		return interaction.reply(t("Tools.Music.Pause"));
	}
}
