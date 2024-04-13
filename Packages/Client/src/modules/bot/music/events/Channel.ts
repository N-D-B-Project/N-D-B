import { MessageTools } from "@/modules/bot/commands/Message";
import type { IDatabaseService } from "@/modules/shared/database/interfaces/IDatabaseService";
import { Extends, Services } from "@/types/Constants";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ChannelType, Client, TextChannel } from "discord.js";
import { Context, ContextOf, On } from "necord";
import { Music } from "../";
import type { IMusicService } from "../interfaces";

@Injectable()
export class ChannelEvents {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(Music.Service) private readonly MusicService: IMusicService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(ChannelEvents.name);

	@On("channelDelete")
	public async onChannelDelete(@Context() [channel]: ContextOf<"channelDelete">) {
		if (channel.type === ChannelType.GuildVoice) {
			const guildData = await this.database.GuildRepo().get(channel.guildId);
			const { Premium } = guildData.Settings;
			const Player = await this.MusicService.getPlayerEvent(channel.guildId, Premium);
			if (Player?.voiceChannelId === channel.id && channel.members.has(this.client.user.id)) {
				Player.destroy();
				const textChannel = (await channel.guild.channels.fetch(Player.textChannelId)) as TextChannel;
				MessageTools.send(textChannel, {
					content: this.translate.getTranslation(
						"Events/ChannelDelete:Music:DeletedChannel",
						channel.guild.preferredLocale,
					),
				});
			}
		}
	}
}
