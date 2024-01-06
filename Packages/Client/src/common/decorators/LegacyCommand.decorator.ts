import { LegacyCommandOptions } from "@/types";
import { Reflector } from "@nestjs/core";
import { LegacyCommandsDiscovery } from "../../modules/commands/Commands.discovery";

export const LegacyCommand = Reflector.createDecorator<LegacyCommandOptions, LegacyCommandsDiscovery>({
	transform: (options: LegacyCommandOptions) => new LegacyCommandsDiscovery(options),
});
