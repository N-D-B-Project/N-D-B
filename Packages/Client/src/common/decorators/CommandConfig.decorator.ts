import { CommandConfigOptions } from "@/types";
import { Reflector } from "@nestjs/core";

export const CommandConfig = Reflector.createDecorator<CommandConfigOptions>();
