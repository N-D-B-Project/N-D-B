// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { PlayerManagerService } from "@necord/lavalink";
import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { channelMention } from "discord.js";
import { Context, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "#src/common/decorators/index.js";
import { InteractionTools } from "#src/modules/commands/Interaction.js";
import { MusicCommand } from "#src/modules/music/Music.decorator.js";

@MusicCommand()
export class LeaveCommand {
	public constructor(private readonly playerManager: PlayerManagerService) {}

	@Subcommand({
		name: "leave",
		nameLocalizations: localizationMapByKey("Music.leave.name"),
		description: "Leave from voice channel",
		descriptionLocalizations: localizationMapByKey("Music.leave.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: [],
		user: [],
		guildOnly: false,
		testOnly: true,
		ownerOnly: false,
	})
	public async onLeave(
		@Context() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
		const player = this.playerManager.get(interaction.guild.id);
		const channelId = player.voiceChannelId;
		if (player.connected) await player.disconnect(true);

		return InteractionTools.reply(
			interaction,
			{
				content: t("Tools.Music.Leave", {
					VoiceChannel: channelMention(channelId),
				}),
			},
			false,
		);
	}
}
