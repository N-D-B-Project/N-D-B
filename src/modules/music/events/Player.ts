import type { Config } from "@/modules/SharedModule/config/types";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import type { Client, Guild, TextChannel, VoiceChannel } from "discord.js";
import type { Player } from "lavalink-client";
import { Music } from "..";
import { MessageTools } from "../../commands/Message";
import type { IMusicEmbeds } from "../interfaces";

@Injectable()
export class PlayerEvents {
	public constructor(
		@Inject(Music.Embeds) private readonly embeds: IMusicEmbeds,
		private readonly config: ConfigService<Config>,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(PlayerEvents.name);

	@OnEvent("player.create")
	public async onPlayerCreate(player: Player): Promise<void> {
		const guild = (await this.client.guilds.fetch(player.guildId)) as Guild;
		this.logger.log(`Player iniciando no servidor: ${guild.name}(${guild.id})`);
		const textChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
		const voiceChannel = this.client.channels.cache.get(player.voiceChannelId) as VoiceChannel;

		player.playerMessage = (
			await MessageTools.send(textChannel, {
				embeds: [await this.embeds.PlayerCreate(guild, textChannel, voiceChannel, player)],
			})
		).id;

		textChannel.messages.fetch(player.playerMessage).then((msg) => {
			if (msg?.deletable) {
				setTimeout(async () => {
					msg.delete().catch((error: Error) => {
						this.logger.warn('Não consegui deletar o "Player_MESSAGE"', error);
					});
				}, 5 * 1000);
			}
		});

		if (this.config.getOrThrow<Config["Music"]>("Music").Client.serverDeaf) {
			for (let i = 0; i <= 5; i++) {
				await new Promise((resolve) => {
					setTimeout(() => {
						resolve(2);
						guild.members.me.voice.setDeaf(true);
						i = 10;
					}, 1000);
				});
			}
		}
	}

	@OnEvent("player.move")
	public async onPlayerMove(player: Player, oldChannel: string, newChannel: string): Promise<void> {
		if (!newChannel) {
			const textChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
			const voiceChannel = this.client.channels.cache.get(player.voiceChannelId) as VoiceChannel;
			MessageTools.send(textChannel, {
				embeds: [await this.embeds.PlayerMove(textChannel, voiceChannel)],
			});
			try {
				textChannel.messages.fetch(player.get("MESSAGE")).then((msg) => {
					if (msg?.deletable) {
						setTimeout(() => {
							msg.delete();
						}, 2000);
					}
				});
			} catch (error) {
				this.logger.error(String(error));
			}
			player.destroy();
		} else {
			player.voiceChannelId = newChannel;
			if (player.paused) return;
			setTimeout(() => {
				player.pause();
				setTimeout(() => {
					player.resume();
				}, this.client.ws.ping * 2);
			}, this.client.ws.ping * 2);
		}
	}

	@OnEvent("player.disconnect")
	public async onPlayerDisconnect(player: Player, oldChannel: string): Promise<void> {
		const guild = this.client.guilds.cache.get(player.guildId) as Guild;
		this.logger.log(`Player desconectado no servidor: ${guild.name}(${guild.id})\n canal: ${oldChannel}`);
		player.destroy();
	}

	@OnEvent("player.destroy")
	public async onPlayerDestroy(player: Player, destroyReason: string): Promise<void> {
		const guild = this.client.guilds.cache.get(player.guildId) as Guild;
		this.logger.log(`Player destruído no servidor: ${guild.name}(${guild.id}) | Motivo: ${destroyReason}`);
	}
}
