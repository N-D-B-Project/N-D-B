import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { InteractionTools } from "@/modules/commands/Interaction";
import { MusicCommand } from "@/modules/music/Music.decorator";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { PlayerManager } from "@necord/lavalink";
import {
	CurrentTranslate,
	type TranslationFn,
	localizationMapByKey,
} from "@necord/localization";
import { Context, type SlashCommandContext, Subcommand } from "necord";

@MusicCommand()
export class PauseCommand {
	public constructor(private readonly playerManager: PlayerManager) {}

	@Subcommand({
		name: "pause",
		nameLocalizations: localizationMapByKey("Music.pause.name"),
		description: "Pause the queue",
		descriptionLocalizations: localizationMapByKey("Music.pause.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: [],
		user: [],
		guildOnly: false,
		testOnly: true,
		ownerOnly: false,
	})
	public async onPause(
		@Context() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const player = this.playerManager.get(interaction.guild.id);

		if (player.playing) await player.pause();

		return InteractionTools.reply(
			interaction,
			{
				content: t("Tools.Music.Pause"),
			},
			false,
		);
	}
}
