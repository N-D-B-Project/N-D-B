import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { CurrentTranslate, TranslationFn, localizationMapByKey } from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { GuildMember, VoiceChannel, channelMention } from "discord.js";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { MusicCommand } from "../Music.decorator";
import type { IMusicService } from "../interfaces";
import { Music } from "../types/constants";

@MusicCommand()
export class JoinCommand {
	public constructor(@Inject(Music.Service) private readonly service: IMusicService) {}

	private readonly logger = new Logger(JoinCommand.name);

	@Subcommand({
		name: "join",
		description: "Makes the bot join your voice channel and creates a player",
		nameLocalizations: localizationMapByKey("Music.join.name"),
		descriptionLocalizations: localizationMapByKey("Music.join.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext, @CurrentTranslate() t: TranslationFn) {
		let player = await this.service.getPlayer(interaction);

		if (!(await this.service.hasVoice(interaction))) return;

		if (!player) {
			player = await this.service.createPlayer(
				interaction,
				(interaction.member as GuildMember).voice.channel as VoiceChannel,
				interaction.channel.id,
			);
		}

		if (!player.connected) {
			player.playerAuthor = interaction.user.id;
			await player.connect();
		}

		return interaction.reply(
			t("Tools.Music.Join", {
				VoiceChannel: channelMention(player.voiceChannelId),
			}),
		);
	}
}
