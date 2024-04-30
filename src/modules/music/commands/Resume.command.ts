import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import {
  CurrentTranslate,
  localizationMapByKey,
  type TranslationFn,
} from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Ctx, Subcommand, type SlashCommandContext } from "necord";
import { Music } from "..";
import { MusicCommand } from "../Music.decorator";
import type { IMusicService } from "../interfaces";

@MusicCommand()
export class ResumeCommand {
	public constructor(@Inject(Music.Service) private readonly service: IMusicService) {}

	private readonly logger = new Logger(ResumeCommand.name);

	@Subcommand({
		name: "resume",
		description: "Resumes the music queue",
		nameLocalizations: localizationMapByKey("Music.resume.name"),
		descriptionLocalizations: localizationMapByKey("Music.resume.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: ["SendMessages"],
		user: ["SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const player = await this.service.getPlayer(interaction);
		if (!(await this.service.checkers(interaction))) return;
		await player.resume();
		return interaction.reply(t("Tools.Music.Resume"));
	}
}
