import { CommandConfigOptions } from "@/modules/commands/types";
import { Reflector } from "@nestjs/core";

export const CommandConfig = Reflector.createDecorator<CommandConfigOptions>();
