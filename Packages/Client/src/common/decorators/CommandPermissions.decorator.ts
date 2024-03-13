import { CommandPermissionsOptions } from "@/modules/commands/types";
import { Reflector } from "@nestjs/core";

export const CommandPermissions = Reflector.createDecorator<CommandPermissionsOptions>();
