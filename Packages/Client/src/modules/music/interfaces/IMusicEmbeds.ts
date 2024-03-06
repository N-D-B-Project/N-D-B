import type { Context } from "@/modules/commands/Commands.context";
import type { EmbedBuilder, Guild, TextChannel, User, VoiceChannel } from "discord.js";
import type { Player, SearchResult, Track, TrackExceptionEvent } from "lavalink-client";

export interface IMusicEmbeds {
	NoPlayer(context: Context): Promise<EmbedBuilder>;
	NoChannel(context: Context): Promise<EmbedBuilder>;
	NoArgs(context: Context): Promise<EmbedBuilder>;
	LoadType(
		context: Context,
		loadType: string,
		Checker: {
			Emoji: string;
			Name: string;
		},
		track?: Track,
	): Promise<EmbedBuilder>;
	Playlist(
		context: Context,
		res: SearchResult,
		Checker: {
			Emoji: string;
			Name: string;
		},
	): Promise<EmbedBuilder>;
	NowPlaying(context: Context, player: Player, progressBar: string): Promise<EmbedBuilder>;
	PlayerCreate(
		guild: Guild,
		textChannel: TextChannel,
		voiceChannel: VoiceChannel,
		player: Player,
	): Promise<EmbedBuilder>;
	PlayerMove(textChannel: TextChannel, voiceChannel: VoiceChannel): Promise<EmbedBuilder>;
	TrackStart(
		textChannel: TextChannel,
		track: Track,
		Requester: User,
		Timer: string,
		Checker: {
			Emoji: string;
			Name: string;
		},
		Platform: string,
	): Promise<EmbedBuilder>;
	LoadType(
		context: Context,
		loadType: string,
		Checker: {
			Emoji: string;
			Name: string;
		},
		track?: Track,
	): Promise<EmbedBuilder>;
	NowPlaying(context: Context, player: Player, progressBar: string): Promise<EmbedBuilder>;
	PlayerCreate(
		guild: Guild,
		textChannel: TextChannel,
		voiceChannel: VoiceChannel,
		player: Player,
	): Promise<EmbedBuilder>;
	TrackStart(
		textChannel: TextChannel,
		track: Track,
		Requester: User,
		Timer: string,
		Checker: {
			Emoji: string;
			Name: string;
		},
		Platform: string,
	): Promise<EmbedBuilder>;
	TrackError(textChannel: TextChannel, track: Track, payload: TrackExceptionEvent): Promise<EmbedBuilder>;
	TrackStuck(textChannel: TextChannel, track: Track): Promise<EmbedBuilder>;
}
