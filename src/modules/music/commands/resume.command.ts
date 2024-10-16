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
import { ApplicationIntegrationType, InteractionContextType } from "discord.js";
import { Context, type SlashCommandContext, Subcommand } from "necord";

@MusicCommand()
export class ResumeCommand {
	public constructor(private readonly playerManager: PlayerManager) {}

	@Subcommand({
		name: "resume",
		nameLocalizations: localizationMapByKey("Music.resume.name"),
		description: "Resume the queue",
		descriptionLocalizations: localizationMapByKey("Music.resume.description"),
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
