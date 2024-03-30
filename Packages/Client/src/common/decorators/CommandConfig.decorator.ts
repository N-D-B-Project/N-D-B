import { CommandConfigOptions } from "@/modules/bot/commands/types";
import { Reflector } from "@nestjs/core";

export const CommandConfig = Reflector.createDecorator<CommandConfigOptions>();
