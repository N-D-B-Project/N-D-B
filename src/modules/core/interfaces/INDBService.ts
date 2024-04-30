import { Content } from "@/types";
import type { CommandInteraction, EmbedBuilder } from "discord.js";

export interface INDBService {
	buildPaginator(interaction: CommandInteraction, embeds: EmbedBuilder[], id: string): Promise<Content>;
}
