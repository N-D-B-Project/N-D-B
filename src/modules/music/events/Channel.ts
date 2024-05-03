import type { IDatabaseService } from "@/modules/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import { LOCALIZATION_ADAPTER, type NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ChannelType, type Client, type TextChannel } from "discord.js";
import { Context, On, type ContextOf } from "necord";
import { Music } from "..";
import { MessageTools } from "../../commands/Message";
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
						"Events.ChannelDelete.Music.DeletedChannel",
						channel.guild.preferredLocale,
					),
				});
			}
		}
	}
}
