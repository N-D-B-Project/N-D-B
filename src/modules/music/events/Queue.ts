import { MessageTools } from "@/modules/commands/Message";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@/modules/config";
import { Embeds, type IMusicEmbeds, Services } from "@/types";
import {
	type LavalinkManagerContextOf,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NecordLavalinkService,
	OnLavalinkManager,
} from "@necord/lavalink";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { Context } from "necord";
import ms from "parse-ms";

@Injectable()
export class QueueEvents {
	public constructor(
		@Inject(Embeds.Music) private readonly musicEmbeds: IMusicEmbeds,
		@Inject(Services.Config) private readonly configService: ConfigService,
		private readonly lavalinkService: NecordLavalinkService,
	) {}

	private readonly logger = new Logger(QueueEvents.name);

	@OnLavalinkManager("queueEnd")
	public async onQueueEnd(
		@Context() [player, track, payload]: LavalinkManagerContextOf<"queueEnd">,
	): Promise<void> {
		const { guild, textChannel, voiceChannel } =
			await this.lavalinkService.extractPlayerData(player);
		const config = this.configService.get("Player").AutoLeaveEmpty.Queue;
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
							msg.delete().catch((error: Error) => {
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
