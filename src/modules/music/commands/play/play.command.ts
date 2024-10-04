import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { InteractionTools } from "@/modules/commands/Interaction";
import { MusicCommand } from "@/modules/music/Music.decorator";
import { NecordLavalinkService, PlayerManager } from "@necord/lavalink";
import {
	CurrentTranslate,
	TranslationFn,
	localizationMapByKey,
} from "@necord/localization";
import { UseInterceptors } from "@nestjs/common";
import { isURL } from "class-validator";
import {
	ApplicationIntegrationType,
	EmbedBuilder,
	InteractionContextType,
} from "discord.js";
import { SearchResult } from "lavalink-client";
import { Context, Options, SlashCommandContext, Subcommand } from "necord";
import { MusicService } from "../../Music.service";
import { PlayAutocompleteInterceptor } from "./play.autocomplete";
import { PlayDto } from "./play.dto";
import { PlayEmbeds } from "./play.embeds";

@MusicCommand()
export class PlayCommand {
	public constructor(
		private readonly playerManager: PlayerManager,
		private readonly lavalinkService: NecordLavalinkService,
	) {}

	@UseInterceptors(PlayAutocompleteInterceptor)
	@Subcommand({
		name: "play",
		nameLocalizations: localizationMapByKey("Music.play.name"),
		description: "play a track",
		descriptionLocalizations: localizationMapByKey("Music.play.description"),
		integrationTypes: [ApplicationIntegrationType.GuildInstall],
		contexts: [InteractionContextType.Guild],
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: [],
		user: [],
		guildOnly: false,
		testOnly: false,
		ownerOnly: false,
	})
	public async onPlay(
		@Context() [interaction]: SlashCommandContext,
		@Options() { query, source }: PlayDto,
		@CurrentTranslate() t: TranslationFn,
	) {
		const player =
			this.playerManager.get(interaction.guild.id) ??
			this.playerManager.create({
				...this.lavalinkService.extractInfoForPlayer(interaction),
				selfDeaf: true,
				selfMute: false,
				volume: 10,
			});

		const res = (
			MusicService.isValidSourceURL(query)
				? await player.search(query, interaction.user)
				: await player.search(
						{
							query,
							source: source ?? "ytsearch",
						},
						interaction.user,
					)
		) as SearchResult;

		const Embeds = new PlayEmbeds(interaction, t);
		let embed: EmbedBuilder;
		switch (res.loadType) {
			case "error":
				if (!player.queue.current)
					player.destroy("Load Type Error and no current on queue");
				embed = await Embeds.ErrorLoadType();
				break;
			case "empty":
				if (!player.queue.current)
					player.destroy("Load Type Empty and no current on queue");
				embed = await Embeds.EmptyLoadType();
				break;
			case "track":
			case "search":
				if (!player.connected) await player.connect();
				await player.queue.add(res.tracks[0]);
				if (!player.playing) await player.play({ paused: false });
				embed = await Embeds.TrackSearchLoadType(res.tracks[0]);
				break;
			case "playlist":
				if (isURL(query)) {
					if (!player.connected) await player.connect();
					await player.queue.add(res.tracks);
					if (!player.playing) await player.play({ paused: false });
				}
				embed = await Embeds.PlaylistLoadType(res);
				break;
		}

		return await InteractionTools.reply(
			interaction,
			{
				embeds: [embed],
			},
			false,
		);
	}
}
