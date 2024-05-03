import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import {
  CurrentTranslate,
  type TranslationFn,
  localizationMapByKey,
} from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import {
  type GuildMember,
  type VoiceChannel,
  channelMention,
} from "discord.js";
import { Ctx, type SlashCommandContext, Subcommand } from "necord";
import { Music } from "..";
import { MusicCommand } from "../Music.decorator";
import type { IMusicService } from "../interfaces";

@MusicCommand()
export class LeaveCommand {
	public constructor(@Inject(Music.Service) private readonly service: IMusicService) {}

	private readonly logger = new Logger(LeaveCommand.name);

	@Subcommand({
		name: "leave",
		description: "Leave the voice channel",
		nameLocalizations: localizationMapByKey("Music.leave.name"),
		descriptionLocalizations: localizationMapByKey("Music.leave.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,testOnly: true,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@CurrentTranslate() t: TranslationFn,
	) {
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
			t("Tools/Music:Join", {
				VoiceChannel: channelMention(player.voiceChannelId),
			}),
		);
	}
}
