import type { Context } from "@/modules/commands/Commands.context";
import type { VoiceChannel } from "discord.js";
import type { Player, SourceNames } from "lavalink-client";

export interface IMusicService {
	getPlayer(context: Context): Promise<Player>;
	getPlayerEvent(guildId: string, isPremium: boolean): Promise<Player>;
	createPlayer(context: Context, voiceChannel: VoiceChannel, textChannelId: string): Promise<Player>;
	hasVoice(context: Context): Promise<boolean>;
	sameVoice(context: Context): Promise<boolean>;
	hasPlayer(context: Context): Promise<boolean>;
	checkers(context: Context): Promise<boolean>;
	URLChecker(
		isCommand: boolean,
		context: Context | string,
	): Promise<{
		Emoji: string;
		Name: string;
	}>;
	progressBar(player: Player): Promise<string>;
	formatSourceName(sourceName: SourceNames): string;
}
