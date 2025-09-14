// biome-ignore lint/style/useImportType: <explanation>
import {
	type LavalinkManagerContextOf,
	NecordLavalinkService,
	OnLavalinkManager,
} from "@necord/lavalink";
import { Inject, Injectable, Logger } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@nestjs/config";
import { Context } from "necord";
import ms from "parse-ms";
import { MessageTools } from "@/modules/commands/Message";
import type { Config } from "@/modules/config/types";
import type { IMusicEmbeds } from "../interfaces";
import { Music } from "../types/constants";

@Injectable()
export class QueueEvents {
	public constructor(
		@Inject(Music.Embeds) private readonly musicEmbeds: IMusicEmbeds,
		private readonly lavalinkService: NecordLavalinkService,
		private readonly config: ConfigService,
	) {}

	private readonly logger = new Logger(QueueEvents.name);

	@OnLavalinkManager("queueEnd")
	public async onQueueEnd(
		@Context() [
			player,
			_track,
			_payloadd,
		]: LavalinkManagerContextOf<"queueEnd">,
	): Promise<void> {
		const { guild, textChannel, voiceChannel } =
			await this.lavalinkService.extractPlayerData(player);
		const config =
			this.config.getOrThrow<Config["Music"]>("Music").Player.AutoLeaveEmpty
				.Queue;
		if (config.Enable) {
			setTimeout(async () => {
				const timer = ms(config.Delay);
				const message = await MessageTools.send(textChannel, {
					embeds: [
						await this.musicEmbeds.QueueEndAutoLeaveEmbed(
							guild.preferredLocale,
							voiceChannel.id,
							String(timer),
						),
					],
				});

				textChannel.messages.fetch(message.id).then((msg) => {
					if (msg?.deletable) {
						setTimeout(async () => {
							msg.delete().catch((_error: Error) => {
								this.logger.warn('Não consegui deletar o "Player_MESSAGE"');
							});
						}, 4000);
					}
				});
				player.destroy();
			}, config.Delay);
		}
	}
}
