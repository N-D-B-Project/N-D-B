import { SlashCommandOptions } from "@/modules/commands/types";
import { Reflector } from "@nestjs/core";
import { SlashCommandsDiscovery } from "../../modules/commands/Commands.discovery";

export const SlashCommand = Reflector.createDecorator<SlashCommandOptions, SlashCommandsDiscovery>({
	transform: (options: SlashCommandOptions) => new SlashCommandsDiscovery(options),
});
