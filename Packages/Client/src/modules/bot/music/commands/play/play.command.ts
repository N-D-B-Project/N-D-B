import { CommandConfig, CommandPermissions, ValidatedOptions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { WAIT, isValidURL } from "@/utils/Tools";
import { CurrentTranslate, TranslationFn, localizationMapByKey } from "@necord/localization";
import { Inject, Logger, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommandInteraction, EmbedBuilder, GuildMember, Message, VoiceChannel } from "discord.js";
import { Player, SearchPlatform, SearchResult, SourceLinksRegexes } from "lavalink-client";
import { Ctx, SlashCommandContext, Subcommand } from "necord";
import { MusicCommand } from "../../Music.decorator";
import type { IMusicEmbeds, IMusicService } from "../../interfaces";
import { Music } from "../../types/constants";
import { PlayAutoComplete } from "./play.autocomplete";
import { PlayDTO } from "./play.dto";

@MusicCommand()
export class PlayCommand {
	public constructor(
		@Inject(Music.Embeds) private readonly embeds: IMusicEmbeds,
		@Inject(Music.Service) private readonly service: IMusicService,
	) {}

	private readonly logger = new Logger(PlayCommand.name);

	@Subcommand({
		name: "play",
		description: "Search for a Song or Playlist and play it in a voice channel",
		nameLocalizations: localizationMapByKey("Music.play.name"),
		descriptionLocalizations: localizationMapByKey("Music.play.description"),
	})
	@CommandConfig({ category: "🎵 Music", disable: false })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	@UseInterceptors(PlayAutoComplete)
	public async onCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@ValidatedOptions() { query, source }: PlayDTO,
		@CurrentTranslate() T: TranslationFn,
	): Promise<Message> {
		let res: SearchResult;

		if (!(await this.service.hasVoice(interaction))) {
			return;
		}

		let player = await this.service.getPlayer(interaction);

		if (!player) {
			player = await this.service.createPlayer(
				interaction,
				(interaction.member as GuildMember).voice.channel as VoiceChannel,
				interaction.channel.id,
			);
		}
		if (!player.connected) {
			player.slash = { isSlash: false };
			player.playerAuthor = interaction.user.id;
			await player.connect();
		}

		if (!(await this.service.sameVoice(interaction))) {
			return;
		}

		if (isValidURL(query)) {
			res = (await player.search(query, interaction.user.id)) as SearchResult;
		} else {
			res = (await player.search(
				{
					query,
					source: source ? (source as SearchPlatform) : undefined,
				},
				interaction.user,
			)) as SearchResult;
		}

		const QueryAddedToQueueMessage = await interaction.reply({
			embeds: [await this.LoadType(res, player, interaction, query)],
		});
		await WAIT(5 * 1000);
		await QueryAddedToQueueMessage.delete();
	}

	private async LoadType(
		res: SearchResult,
		player: Player,
		interaction: CommandInteraction,
		query: string,
	): Promise<EmbedBuilder> {
		let Embed: EmbedBuilder;
		const check = await this.service.URLChecker(true, interaction);
		switch (res.loadType) {
			case "error":
				if (!player.queue.current) player.destroy();
				Embed = await this.embeds.LoadType(interaction, "Fail", check);
				break;
			case "empty":
				if (!player.queue.current) player.destroy();
				Embed = await this.embeds.LoadType(interaction, "NoMatches", check);
				break;
			case "search":
			case "track":
				if (!player.connected) {
					player.playerMessage = interaction.id;
					player.playerAuthor = interaction.user.id;
					await player.connect();
				}
				if (!player.playing) {
					await player.queue.add(res.tracks[0]);
					await player.play({ paused: false });
					if (!player.paused && !player.playing) await player.resume();
				} else {
					await player.queue.add(res.tracks[0]);
				}

				Embed = await this.embeds.LoadType(interaction, "Success", check, res.tracks[0]);
				break;
			case "playlist":
				Embed = await this.Playlist(interaction, res, player, query);
				break;
		}

		return Embed;
	}

	private async Playlist(
		interaction: CommandInteraction,
		res: SearchResult,
		player: Player,
		URL: string,
	): Promise<EmbedBuilder> {
		let isValidURL = false;
		for (const regex of Object.values(SourceLinksRegexes)) {
			if (regex.test(URL)) {
				isValidURL = true;
				break;
			}
		}

		if (isValidURL) {
			if (!player.playing) {
				await player.queue.add(res.tracks);
				await player.play({ paused: false });
			} else {
				await player.queue.add(res.tracks[0]);
			}
			if (!player.paused && !player.playing) {
				await player.play({ paused: false });
			}
			return await this.embeds.Playlist(interaction, res, await this.service.URLChecker(true, URL));
		}
	}
}
