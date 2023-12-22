import { CommandOptions } from "@/types";
import { Reflector } from "@nestjs/core";
import { CommandsDiscovery } from "../../modules/commands/Commands.discovery";

export const Command = Reflector.createDecorator<CommandOptions, CommandsDiscovery>({
	transform: (options: CommandOptions) => new CommandsDiscovery(options),
});
