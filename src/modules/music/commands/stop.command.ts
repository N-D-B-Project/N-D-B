// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { PlayerManagerService } from "@necord/lavalink";
import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { Context, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "#src/common/decorators/index.js";
import { InteractionTools } from "#src/modules/commands/Interaction.js";
import { MusicCommand } from "#src/modules/music/Music.decorator.js";

@MusicCommand()
export class StopCommand {
	public constructor(private readonly playerManager: PlayerManagerService) {}

	@Subcommand({
		name: "stop",
		nameLocalizations: localizationMapByKey("Music.stop.name"),
		description: "Stop the queue",
		descriptionLocalizations: localizationMapByKey("Music.stop.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: [],
		user: [],
		guildOnly: false,
		testOnly: true,
		ownerOnly: false,
	})
	public async onStop(
		@Context() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const player = this.playerManager.get(interaction.guild.id);

		await player.stopPlaying(true);
		await player.destroy("Stop Command");

		return InteractionTools.reply(
			interaction,
			{
				content: t("Tools.Music.Stop"),
			},
			false,
		);
	}
}
