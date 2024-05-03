import { Reflector } from "@nestjs/core";
import { PermissionResolvable } from "discord.js";

export interface CommandPermissionsOptions {
	user: PermissionResolvable[];
	bot: PermissionResolvable[];
	guildOnly: boolean;
	testOnly: boolean;
	ownerOnly: boolean;
  guilds?: string[];
}

export const CommandPermissions = Reflector.createDecorator<CommandPermissionsOptions>();
