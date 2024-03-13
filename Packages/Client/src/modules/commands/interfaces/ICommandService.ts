import { Context } from "../Commands.context";
import { LegacyCommandsDiscovery, SlashCommandsDiscovery } from "../Commands.discovery";

export interface ICommandsService {
	loadLegacy(command: LegacyCommandsDiscovery): Promise<void>;
	loadSlash(command: SlashCommandsDiscovery): Promise<void>;
	get(cmdName: string, context: Context): Promise<LegacyCommandsDiscovery | SlashCommandsDiscovery>;
}
