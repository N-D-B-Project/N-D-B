import type { Config } from "@/modules/config/types";
import {
    LOCALIZATION_ADAPTER,
    type NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import {
    EmbedBuilder,
    type Client,
    type TextChannel,
    type VoiceChannel,
} from "discord.js";
import type {
    Player,
    Track,
    TrackEndEvent,
    TrackExceptionEvent,
    TrackStuckEvent,
} from "lavalink-client";
import ms from "parse-ms";
import { MessageTools } from "../../commands/Message";

@Injectable()
export class QueueEvents {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly client: Client,
		private readonly config: ConfigService<Config>,
	) {}

	private readonly logger = new Logger(QueueEvents.name);

	@OnEvent("queue.end")
	public async onQueueEnd(
		player: Player,
		track: Track,
		payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent,
	) {
		const textChannel = this.client.channels.cache.get(
			player.textChannelId,
		) as TextChannel;
		const voiceChannel = this.client.channels.cache.get(
			player.voiceChannelId,
		) as VoiceChannel;
		if (
			this.config.getOrThrow<Config["Music"]>("Music").Player.AutoLeaveEmpty
				.Queue.Enable
		) {
			setTimeout(async () => {
				try {
					if (!player.queue && player.queue.current) {
						const Timer = ms(
							this.config.getOrThrow<Config["Music"]>("Music").Player
								.AutoLeaveEmpty.Queue.Delay,
						);
						const embed = new EmbedBuilder()
							.setAuthor({
								name: this.client.user.tag,
								url: this.client.user.displayAvatarURL(),
							})
							.setColor("#00c26f")
							.setTitle(
								this.translate.getTranslation(
									"Events.PlayerEvents.playerMove.queueEnd.Title",
									textChannel.guild.preferredLocale,
								),
							)
							.setDescription(
								this.translate.getTranslation(
									"Events.PlayerEvents.playerMove.queueEnd.Description",
									textChannel.guild.preferredLocale,
									{
										CHANNEL: voiceChannel.name,
										Timer: String(Timer),
									},
								),
							)
							.setFooter({
								text: this.translate.getTranslation(
									"Events.PlayerEvents.playerMove.queueEnd.Footer",
									textChannel.guild.preferredLocale,
									{
										TIMER: String(Timer),
									},
								),
							})
							.setTimestamp();
						const Message = await MessageTools.send(textChannel, {
							embeds: [embed],
						});

						textChannel.messages.fetch(Message.id).then((msg) => {
							if (msg?.deletable) {
								setTimeout(async () => {
									msg.delete().catch((error: Error) => {
										this.logger.warn('Não consegui deletar o "Player_MESSAGE"');
									});
								}, 4000);
							}
						});
						player.destroy();
					}
				} catch (error) {
					this.logger.error("Queue End Error: ", String(error));
				}
			}, this.config.getOrThrow<Config["Music"]>(
				"Music",
			).Player.AutoLeaveEmpty.Queue.Delay);
		}
	}
}
