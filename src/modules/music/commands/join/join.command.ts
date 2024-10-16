import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { InteractionTools } from "@/modules/commands/Interaction";
import { MusicCommand } from "@/modules/music/Music.decorator";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { NecordLavalinkService, PlayerManager } from "@necord/lavalink";
import {
	CurrentTranslate,
	type TranslationFn,
	localizationMapByKey,
} from "@necord/localization";
import {
	ApplicationIntegrationType,
	InteractionContextType,
	channelMention,
} from "discord.js";
import { Context, Options, type SlashCommandContext, Subcommand } from "necord";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes with validation system>
import { JoinDto } from "./join.dto";

// TODO: Fix not connecting in another channel if already connected (move with command)
@MusicCommand()
export class JoinCommand {
	public constructor(
		private readonly playerManager: PlayerManager,
		private readonly lavalinkService: NecordLavalinkService,
	) {}

	@Subcommand({
		name: "join",
		nameLocalizations: localizationMapByKey("Music.join.name"),
		description: "Join a voice channel",
		descriptionLocalizations: localizationMapByKey("Music.join.description"),
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
	public async onJoin(
		@Context() [interaction]: SlashCommandContext,
		@Options() { channel }: JoinDto,
		@CurrentTranslate() t: TranslationFn,
	) {
		const { voiceChannelId, ...info } =
			this.lavalinkService.extractInfoForPlayer(interaction);
		const player =
			this.playerManager.get(interaction.guild.id) ??
			this.playerManager.create({
				...info,
				voiceChannelId: channel?.id ?? voiceChannelId,
				selfDeaf: true,
				selfMute: false,
				volume: 10,
			});

		if (!player.connected) await player.connect();

		return InteractionTools.reply(
			interaction,
			{
				content: t("Tools.Music.Join", {
					VoiceChannel: channelMention(player.voiceChannelId),
				}),
			},
			false,
		);
	}
}
