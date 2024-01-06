import { CommandPermissionsOptions } from "@/types";
import { Reflector } from "@nestjs/core";

export const CommandPermissions = Reflector.createDecorator<CommandPermissionsOptions>();
