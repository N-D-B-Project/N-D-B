import type { Context } from "@/modules/commands/Commands.context";
import { Content } from "@/modules/commands/types";
import type { EmbedBuilder } from "discord.js";

export interface INDBService {
	buildPaginator(context: Context, embeds: Array<EmbedBuilder>, id: string): Promise<Content>;
}
