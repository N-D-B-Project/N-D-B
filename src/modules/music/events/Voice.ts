import type { Config } from "@/modules/config/types";
import type { IDatabaseService } from "@/modules/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import {
    LOCALIZATION_ADAPTER,
    type NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import {
    ChannelType,
    EmbedBuilder,
    type Client,
    type TextChannel,
    type VoiceChannel,
} from "discord.js";
import { Context, On, type ContextOf } from "necord";
import { Music } from "..";
import type { IMusicService } from "../interfaces";

export class VoiceEvents {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(Music.Service) private readonly MusicService: IMusicService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly client: Client,
		private readonly config: ConfigService<Config>,
	) {}
	private readonly logger = new Logger(VoiceEvents.name);

	@On("voiceStateUpdate")
	async onVoiceStateUpdate(@Context() [oldState, newState]: ContextOf<"voiceStateUpdate">) {
		const guildData = await this.database.GuildRepo().get(oldState.guild.id);
		if (!guildData) return;
		const { Premium } = guildData.Settings!;
		const player = await this.MusicService.getPlayerEvent(newState.guild.id, Premium);

		// Auto Leave Client from Channels if is EMPTY or Everyone is MUTED
		if (oldState && (!newState.channelId || newState.channelId)) {
			if (player && oldState.channelId === player.voiceChannelId) {
				if (
					!(
						(!oldState.streaming && newState.streaming) ||
						(oldState.streaming && !newState.streaming) ||
						(!oldState.serverMute && newState.serverMute && !newState.serverDeaf && !newState.selfDeaf) ||
						(oldState.serverMute && !newState.serverMute && !newState.serverDeaf && !newState.selfDeaf) ||
						(!oldState.selfMute && newState.selfMute && !newState.serverDeaf && !newState.selfDeaf) ||
						(oldState.selfMute && !newState.selfMute && !newState.serverDeaf && !newState.selfDeaf) ||
						(!oldState.selfVideo && newState.selfVideo) ||
						(oldState.selfVideo && !newState.selfVideo)
					)
				) {
					if (
						this.config.getOrThrow<Config["Music"]>("Music").Player.AutoLeaveEmpty.Channel.Enable &&
						player &&
						(!oldState.channel.members ||
							oldState.channel.members.size === 0 ||
							oldState.channel.members.filter((mem) => !mem.user.bot && !mem.voice.deaf && !mem.voice.selfDeaf).size <
								1)
					) {
						setTimeout(async () => {
							try {
								let voiceChannel: VoiceChannel;
								voiceChannel = newState.guild.channels.cache.get(player.voiceChannelId) as VoiceChannel;
								if (voiceChannel) {
									voiceChannel = (await voiceChannel.fetch()) as VoiceChannel;
								}
								if (!voiceChannel) {
									voiceChannel = (await newState.guild.channels.fetch(player.voiceChannelId).catch((error) => {
										this.logger.error(error);
									})) as VoiceChannel;
								}
								if (!voiceChannel) return player.destroy();
								if (
									!voiceChannel.members ||
									voiceChannel.members.size === 0 ||
									voiceChannel.members.filter(
										(member) => !member.user.bot && !member.voice.deaf && !member.voice.selfDeaf,
									).size < 1
								) {
									player.destroy("Auto Leave Client from Channels if is EMPTY or Everyone is MUTED");
								}
							} catch (error) {
								this.logger.error(String(error));
							}
						}, this.config.getOrThrow<Config["Music"]>("Music").Player.AutoLeaveEmpty.Channel.Delay || 60000);
					}
				}
			}
		}
	}

	@On("voiceChannelJoin")
	public async onVoiceChannelJoin(@Context() [member, channel]: ContextOf<"voiceChannelJoin">) {
		if (member.id === this.client.user.id) {
			// Auto set Client as Speaker in Stage Channels
			if (channel?.type === ChannelType.GuildStageVoice && channel.guild.members.me.voice.suppress) {
				if (
					channel.guild.members.me.permissions.has("Speak") ||
					channel.permissionsFor(channel.guild.members.me).has("Speak")
				) {
					channel.guild.members.me.voice.setSuppressed(false);
				}
			}

			// Mute Client when join
			if (!channel?.guild.members.me.voice.deaf) {
				if (
					channel.guild.members.me.permissions.has("DeafenMembers") ||
					channel.permissionsFor(channel.guild.members.me).has("DeafenMembers")
				) {
					member.voice.setDeaf(true);
				}
			}
		}
	}

	@On("voiceChannelUndeaf")
	public async onVoiceChannelUndeaf(@Context() [member, type]: ContextOf<"voiceChannelUndeaf">) {
		const { Premium } = (await this.database.GuildRepo().get(member.guild.id)).Settings;

		const player = await this.MusicService.getPlayerEvent(member.guild.id, Premium);
		// Anti Unmute Client
		if (member.id === this.client.user.id) {
			member.voice.setDeaf(true);
			const textChannel = member.guild.channels.cache.get(player.textChannelId) as TextChannel;

			textChannel.send({
				embeds: [
					new EmbedBuilder()
						.setColor("#c20e00")
						.setAuthor({
							name: this.client.user.tag,
							iconURL: this.client.user.displayAvatarURL(),
						})
						.setDescription(
							this.translate.getTranslation("Events.VoiceStateUpdate.UNMute", member.guild.preferredLocale),
						)
						.setTimestamp()
						.setFooter({
							text: this.translate.getTranslation("Events.VoiceStateUpdate.Embed.Footer", member.guild.preferredLocale),
						}),
				],
			});
		}
	}
}
