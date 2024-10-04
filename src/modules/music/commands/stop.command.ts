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
export class StopCommand {
	public constructor(private readonly playerManager: PlayerManager) {}

	@Subcommand({
		name: "stop",
		nameLocalizations: localizationMapByKey("Music.stop.name"),
		description: "Stop the queue",
		descriptionLocalizations: localizationMapByKey("Music.stop.description"),
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
