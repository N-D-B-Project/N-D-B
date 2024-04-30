import type { CommandInteraction, EmbedBuilder, Guild, TextChannel, User, VoiceChannel } from "discord.js";
import type { Player, SearchResult, Track, TrackExceptionEvent } from "lavalink-client";

export interface IMusicEmbeds {
	NoPlayer(interaction: CommandInteraction): Promise<EmbedBuilder>;
	NoChannel(interaction: CommandInteraction): Promise<EmbedBuilder>;
	LoadType(
		interaction: CommandInteraction,
		loadType: string,
		Checker: {
			Emoji: string;
			Name: string;
		},
		track?: Track,
	): Promise<EmbedBuilder>;
	Playlist(
		interaction: CommandInteraction,
		res: SearchResult,
		Checker: {
			Emoji: string;
			Name: string;
		},
	): Promise<EmbedBuilder>;
	NowPlaying(interaction: CommandInteraction, player: Player, progressBar: string): Promise<EmbedBuilder>;
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
		interaction: CommandInteraction,
		loadType: string,
		Checker: {
			Emoji: string;
			Name: string;
		},
		track?: Track,
	): Promise<EmbedBuilder>;
	NowPlaying(interaction: CommandInteraction, player: Player, progressBar: string): Promise<EmbedBuilder>;
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
	TrackError(textChannel: TextChannel, track: Track, payload: string): Promise<EmbedBuilder>;
	TrackStuck(textChannel: TextChannel, track: Track): Promise<EmbedBuilder>;
}
