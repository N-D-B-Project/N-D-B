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
import { channelMention } from "discord.js";
import { Context, type SlashCommandContext, Subcommand } from "necord";

@MusicCommand()
export class LeaveCommand {
	public constructor(private readonly playerManager: PlayerManager) {}

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
