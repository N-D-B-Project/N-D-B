import type { Ii18nService } from "@/modules/bot/i18n/interfaces/Ii18nService";
import { Config } from "@/modules/shared/config/types";
import { Extends } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { Client, EmbedBuilder, TextChannel, VoiceChannel } from "discord.js";
import { Player, Track, TrackEndEvent, TrackExceptionEvent, TrackStuckEvent } from "lavalink-client";
import ms from "parse-ms";
import { MessageTools } from "../../commands/Message";

@Injectable()
export class QueueEvents {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
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
		const textChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
		const voiceChannel = this.client.channels.cache.get(player.voiceChannelId) as VoiceChannel;
		if (this.config.getOrThrow<Config["Music"]>("Music").Player.AutoLeaveEmpty.Queue.Enable) {
			setTimeout(async () => {
				try {
					if (!player.queue && player.queue.current) {
						const Timer = ms(this.config.getOrThrow<Config["Music"]>("Music").Player.AutoLeaveEmpty.Queue.Delay);
						const embed = new EmbedBuilder()
							.setAuthor({
								name: this.client.user.tag,
								url: this.client.user.displayAvatarURL(),
							})
							.setColor("#00c26f")
							.setTitle(await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerMove:queueEnd:Title"))
							.setDescription(
								await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerMove:queueEnd:Description", {
									CHANNEL: voiceChannel.name,
									Timer: Timer,
								}),
							)
							.setFooter({
								text: await this.Translate.Guild(textChannel, "Events/PlayerEvents:playerMove:queueEnd:Footer", {
									TIMER: Timer,
								}),
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
			}, this.config.getOrThrow<Config["Music"]>("Music").Player.AutoLeaveEmpty.Queue.Delay);
		}
	}
}
