// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { NecordLavalinkService, PlayerManagerService } from "@necord/lavalink";
import {
	CurrentTranslate,
	localizationMapByKey,
	type TranslationFn,
} from "@necord/localization";
import { UseInterceptors } from "@nestjs/common";
import { isURL } from "class-validator";
import type { EmbedBuilder } from "discord.js";
import type { SearchResult } from "lavalink-client";
import { Context, Options, type SlashCommandContext, Subcommand } from "necord";
import {
	CommandConfig,
	CommandPermissions,
} from "#src/common/decorators/index.js";
import { InteractionTools } from "#src/modules/commands/Interaction.js";
import { MusicCommand } from "#src/modules/music/Music.decorator.js";
import { MusicService } from "../../Music.service.js";
import { PlayAutocompleteInterceptor } from "./play.autocomplete.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in classes with validation system>
import { PlayDto } from "./play.dto.js";
import { PlayEmbeds } from "./play.embeds.js";

@MusicCommand()
export class PlayCommand {
	public constructor(
		private readonly playerManager: PlayerManagerService,
		private readonly lavalinkService: NecordLavalinkService,
	) {}

	@UseInterceptors(PlayAutocompleteInterceptor)
	@Subcommand({
		name: "play",
		nameLocalizations: localizationMapByKey("Music.play.name"),
		description: "play a track",
		descriptionLocalizations: localizationMapByKey("Music.play.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: [],
		user: [],
		guildOnly: false,
		testOnly: true,
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
