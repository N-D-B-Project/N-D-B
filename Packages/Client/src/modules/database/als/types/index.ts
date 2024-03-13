import type { LegacyCommandsDiscovery, SlashCommandsDiscovery } from "@/modules/commands/Commands.discovery";
import type { Collection } from "discord.js";

export interface AlsStore {
	PrismaConnected: boolean;
	LegacyCommands: Collection<string, LegacyCommandsDiscovery>;
	Aliases: Collection<string, string>;
	SlashCommands: Collection<string, SlashCommandsDiscovery>;
	SubCommands: Collection<string, SlashCommandsDiscovery>;
}
