import type { CommandInteraction, VoiceChannel } from "discord.js";
import type { Player, SourceNames } from "lavalink-client";

export interface IMusicService {
	getPlayer(interaction: CommandInteraction): Promise<Player>;
	getPlayerEvent(guildId: string, isPremium: boolean): Promise<Player>;
	createPlayer(interaction: CommandInteraction, voiceChannel: VoiceChannel, textChannelId: string): Promise<Player>;
	hasVoice(interaction: CommandInteraction): Promise<boolean>;
	sameVoice(interaction: CommandInteraction): Promise<boolean>;
	hasPlayer(interaction: CommandInteraction): Promise<boolean>;
	checkers(interaction: CommandInteraction): Promise<boolean>;
	URLChecker(
		isCommand: boolean,
		interaction: CommandInteraction | string,
	): Promise<{
		Emoji: string;
		Name: string;
	}>;
	progressBar(player: Player): Promise<string>;
	formatSourceName(sourceName: SourceNames): string;
}
