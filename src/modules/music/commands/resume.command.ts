// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { PlayerManagerService } from "@necord/lavalink";
import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Context, type SlashCommandContext, Subcommand } from "necord";
import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { InteractionTools } from "@/modules/commands/Interaction";
import { MusicCommand } from "@/modules/music/Music.decorator";

@MusicCommand()
export class ResumeCommand {
	public constructor(private readonly playerManager: PlayerManagerService) {}

	@Subcommand({
		name: "resume",
		nameLocalizations: localizationMapByKey("Music.resume.name"),
		description: "Resume the queue",
		descriptionLocalizations: localizationMapByKey("Music.resume.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: [],
		user: [],
		guildOnly: false,
		testOnly: true,
		ownerOnly: false,
	})
	public async onResume(
		@Context() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const player = this.playerManager.get(interaction.guild.id);

		if (player.paused) await player.resume();

		return InteractionTools.reply(
			interaction,
			{
				content: t("Tools.Music.Resume"),
			},
			false,
		);
	}
}
