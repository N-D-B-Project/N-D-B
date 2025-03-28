import { MessageTools } from "@/modules/commands/Message";
import { Embeds, type IMusicEmbeds } from "@/types";
import {
	type LavalinkManagerContextOf,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NecordLavalinkService,
	OnLavalinkManager,
} from "@necord/lavalink";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Context } from "necord";

@Injectable()
export class PlayerEvents {
	public constructor(
		@Inject(Embeds.Music)
		private readonly musicEmbeds: IMusicEmbeds,
		private readonly lavalinkService: NecordLavalinkService,
	) {}

	private readonly logger = new Logger(PlayerEvents.name);

	@OnLavalinkManager("playerCreate")
	public async onPlayerCreate(
		@Context() [player]: LavalinkManagerContextOf<"playerCreate">,
	): Promise<void> {
		const { guild, textChannel, voiceChannel } =
			await this.lavalinkService.extractPlayerData(player);
		this.logger.log(`Player: \`${guild.name}(${guild.id})\` created`);

		const message = await MessageTools.send(textChannel, {
			embeds: [
				await this.musicEmbeds.PlayerCreateEmbed(
					guild,
					textChannel.id,
					voiceChannel.id,
				),
			],
		});
		player.set(PlayerProps.message, message.id);

		textChannel.messages.fetch(player.get(PlayerProps.message)).then((msg) => {
			if (msg?.deletable) {
				setTimeout(async () => {
					msg.delete().catch((error: Error) => {
						this.logger.warn('Não consegui deletar o "Player_MESSAGE"', error);
					});
				}, 10 * 1000);
			}
		});
	}

	@OnLavalinkManager("playerDestroy")
	public async onPlayerDestroy(
		@Context() [player, reason]: LavalinkManagerContextOf<"playerDestroy">,
	): Promise<void> {
		const { guild } = await this.lavalinkService.extractPlayerData(player);
		this.logger.log(
			`Player: \`${guild.name}(${guild.id})\` destroyed with reason: ${reason}`,
		);
	}

	@OnLavalinkManager("playerDisconnect")
	public async onPlayerDisconnect(
		@Context() [
			player,
			voiceChannel,
		]: LavalinkManagerContextOf<"playerDisconnect">,
	): Promise<void> {
		this.logger.log(`Player disconnected from ${voiceChannel}`);
	}

	@OnLavalinkManager("playerMove")
	public async onPlayerMove(
		@Context() [
			player,
			oldVoiceChannel,
			newVoiceChannel,
		]: LavalinkManagerContextOf<"playerMove">,
	): Promise<void> {
		const { guild, textChannel } =
			await this.lavalinkService.extractPlayerData(player);
		if (!newVoiceChannel) {
			MessageTools.send(textChannel, {
				embeds: [
					await this.musicEmbeds.PlayerMoveKickEmbed(
						guild.preferredLocale,
						oldVoiceChannel,
					),
				],
			});

			textChannel.messages
				.fetch(player.get(PlayerProps.message))
				.then((msg) => {
					if (msg?.deletable) {
						setTimeout(async () => {
							msg.delete().catch((error: Error) => {
								this.logger.warn(
									'Não consegui deletar o "Player_MESSAGE"',
									error,
								);
							});
						}, 10 * 1000);
					}
				});
			player.destroy("PlayerMove no channel(kick)");
			return;
		}
		player.voiceChannelId = newVoiceChannel;
		if (player.paused) player.resume();
	}

	@OnLavalinkManager("playerUpdate")
	public async onPlayerUpdate(
		@Context() [oldPlayer, newPlayer]: LavalinkManagerContextOf<"playerUpdate">,
	) {}

	@OnLavalinkManager("playerSocketClosed")
	public async onPlayerSocketClosed(
		@Context() [
			player,
			payload,
		]: LavalinkManagerContextOf<"playerSocketClosed">,
	) {}
}
