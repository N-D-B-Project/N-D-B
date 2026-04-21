import type { CommandInteraction, EmbedBuilder } from "discord.js";
import type { Content } from "@/types";

export interface INDBService {
	buildPaginator(
		interaction: CommandInteraction,
		embeds: EmbedBuilder[],
		id: string,
	): Promise<Content>;
}
