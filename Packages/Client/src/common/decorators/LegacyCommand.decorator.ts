import { LegacyCommandsDiscovery } from "@/modules/bot/commands/Commands.discovery";
import { LegacyCommandOptions } from "@/modules/bot/commands/types";
import { Reflector } from "@nestjs/core";

export const LegacyCommand = Reflector.createDecorator<LegacyCommandOptions, LegacyCommandsDiscovery>({
	transform: (options: LegacyCommandOptions) => new LegacyCommandsDiscovery(options),
});
