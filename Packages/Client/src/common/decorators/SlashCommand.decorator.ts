import { SlashCommandsDiscovery } from "@/modules/bot/commands/Commands.discovery";
import { SlashCommandOptions } from "@/modules/bot/commands/types";
import { Reflector } from "@nestjs/core";

export const SlashCommand = Reflector.createDecorator<SlashCommandOptions, SlashCommandsDiscovery>({
	transform: (options: SlashCommandOptions) => new SlashCommandsDiscovery(options),
});
