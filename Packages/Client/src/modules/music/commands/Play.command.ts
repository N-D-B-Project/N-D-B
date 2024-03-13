import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { CommandContext, Context } from "@/modules/commands/Commands.context";
import { WAIT, isValidURL } from "@/utils/Tools";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { EmbedBuilder, Message, VoiceChannel } from "discord.js";
import { Player, SearchResult, SourceLinksRegexes } from "lavalink-client";
import { Music } from "../";
import type { IMusicEmbeds, IMusicService } from "../interfaces";

@Injectable()
export class PlayCommand {
	public constructor(
		@Inject(Music.Embeds) private readonly embeds: IMusicEmbeds,
		@Inject(Music.Service) private readonly service: IMusicService,
	) {}

	private readonly logger = new Logger(PlayCommand.name);

	@LegacyCommand({
		name: "Play",
		aliases: ["play", "p", "P"],
		description: "Search a Song and Play it on a Voice Channel",
		usage: "<query>",
		args: {
			min: 1,
			max: Number.POSITIVE_INFINITY,
		},
	})
	@SlashCommand({
		type: "Sub",
		name: "play",
		deployMode: "Test",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext): Promise<Message> {
		const Search = context.getArg("query", -1);
		let res: SearchResult;

		if (!(await this.service.hasVoice(context))) {
			return;
		}

		let player = await this.service.getPlayer(context);

		if (!player) {
			player = await this.service.createPlayer(
				context,
				(await context.getMember()).voice.channel as VoiceChannel,
				context.channel.id,
			);
		}
		if (!player.connected) {
			player.slash = { isSlash: false };
			player.playerAuthor = context.author.id;
			await player.connect();
		}

		if (!(await this.service.sameVoice(context))) {
			return;
		}

		if (!Search) {
			return context.reply(await this.embeds.NoArgs(context));
		}

		if (isValidURL(Search)) {
			res = (await player.search(Search, context.author.id)) as SearchResult;
		} else {
			res = (await player.search(
				{
					query: Search,
				},
				context.author,
			)) as SearchResult;
		}

		const QueryAddedToQueueMessage = await context.send(await this.LoadType(res, player, context));
		await WAIT(5 * 1000);
		await QueryAddedToQueueMessage.delete();
	}

	private async LoadType(res: SearchResult, player: Player, context: Context): Promise<EmbedBuilder> {
		let Embed: EmbedBuilder;
		const check = await this.service.URLChecker(true, context);
		switch (res.loadType) {
			case "error":
				if (!player.queue.current) player.destroy();
				Embed = await this.embeds.LoadType(context, "Fail", check);
				break;
			case "empty":
				if (!player.queue.current) player.destroy();
				Embed = await this.embeds.LoadType(context, "NoMatches", check);
				break;
			case "search":
			case "track":
				if (!player.connected) {
					player.playerMessage = context.id;
					player.playerAuthor = context.author.id;
					await player.connect();
				}
				if (!player.playing) {
					await player.queue.add(res.tracks[0]);
					await player.play({ paused: false });
					if (!player.paused && !player.playing) await player.resume();
				} else {
					await player.queue.add(res.tracks[0]);
				}

				Embed = await this.embeds.LoadType(context, "Success", check, res.tracks[0]);
				break;
			case "playlist":
				Embed = await this.Playlist(res, player, context);
				break;
		}

		return Embed;
	}

	private async Playlist(res: SearchResult, player: Player, context: Context): Promise<EmbedBuilder> {
		const URL = context.getArg("query", -1);
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
			return await this.embeds.Playlist(context, res, await this.service.URLChecker(true, context));
		}
	}
}
