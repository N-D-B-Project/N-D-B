import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { InteractionTools } from "@/modules/commands/Interaction";
import { MusicCommand } from "@/modules/music/Music.decorator";
import { PlayerManager } from "@necord/lavalink";
import {
	CurrentTranslate,
	TranslationFn,
	localizationMapByKey,
} from "@necord/localization";
import { ApplicationIntegrationType, InteractionContextType } from "discord.js";
import { Context, SlashCommandContext, Subcommand } from "necord";

@MusicCommand()
export class PauseCommand {
	public constructor(private readonly playerManager: PlayerManager) {}

	@Subcommand({
		name: "pause",
		nameLocalizations: localizationMapByKey("Music.pause.name"),
		description: "Pause the queue",
		descriptionLocalizations: localizationMapByKey("Music.pause.description"),
		integrationTypes: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: [],
		user: [],
		guildOnly: false,
		testOnly: false,
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
