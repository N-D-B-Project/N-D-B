import { CommandPermissionsOptions } from "@/modules/bot/commands/types";
import { Reflector } from "@nestjs/core";

export const CommandPermissions = Reflector.createDecorator<CommandPermissionsOptions>();
