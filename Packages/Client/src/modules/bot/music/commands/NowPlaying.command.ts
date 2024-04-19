import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { localizationMapByKey } from "@necord/localization";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { Music } from "../";
import { MusicCommand } from "../Music.decorator";
import type { IMusicEmbeds, IMusicService } from "../interfaces";

@MusicCommand()
export class NowPlayingCommand {
	public constructor(
		@Inject(Music.Embeds) private readonly embeds: IMusicEmbeds,
		@Inject(Music.Service) private readonly service: IMusicService,
	) {}
	private readonly logger = new Logger(NowPlayingCommand.name);

	@Subcommand({
		name: "now_playing",
		description: "Shows what song is playing and more information",
		nameLocalizations: localizationMapByKey("Music.nowplaying.name"),
		descriptionLocalizations: localizationMapByKey("Music.nowplaying.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async onCommandRun(@Ctx() [interaction]: SlashCommandContext) {
		if (!(await this.service.checkers(interaction))) {
			return;
		}

		const player = await this.service.getPlayer(interaction);

		return interaction.reply({
			embeds: [await this.embeds.NowPlaying(interaction, player, await this.service.progressBar(player))],
		});
	}
}
