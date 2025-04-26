import type { EmbedBuilder, Guild } from "discord.js";

export interface IMusicEmbeds {
	PlayerCreateEmbed(
		guild: Guild,
		textChannelId: string,
		voiceChannelId: string,
	): Promise<EmbedBuilder>;

	PlayerMoveKickEmbed(
		guildLocale: string,
		voiceChannelId: string,
	): Promise<EmbedBuilder>;

	QueueEndAutoLeaveEmbed(
		guildLocale: string,
		voiceChannelId: string,
		timer: string,
	): Promise<EmbedBuilder>;
}
