import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Message, VoiceChannel, channelMention } from "discord.js";
import { Music } from "../";
import { CommandContext } from "../../commands/Commands.context";
import type { IMusicService } from "../interfaces";

@Injectable()
export class LeaveCommand {
	public constructor(
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
	) {}

	private readonly logger = new Logger(LeaveCommand.name);

	@LegacyCommand({
		name: "leave",
		aliases: ["Leave"],
		description: "Disconnect's the bot from Voice Channel",
		usage: "",
	})
	@SlashCommand({
		name: "leave",
		type: "Sub",
		deployMode: "Test",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext): Promise<Message> {
		let player = await this.service.getPlayer(context);

		if (!(await this.service.hasVoice(context))) return;

		if (!player) {
			player = await this.service.createPlayer(
				context,
				(await context.getMember()).voice.channel as VoiceChannel,
				context.channel.id,
			);
		}

		if (!player.connected) {
			player.playerAuthor = context.author.id;
			await player.connect();
		}

		return context.reply(
			await this.Translate.Guild(context, "Tools/Music:Join", {
				VoiceChannel: channelMention(player.voiceChannelId),
			}),
		);
	}
}
