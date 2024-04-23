import { Reflector } from "@nestjs/core";
import { PermissionResolvable } from "discord.js";

interface CommandPermissionsOptions {
	user: PermissionResolvable[];
	bot: PermissionResolvable[];
	guildOnly?: boolean;
	ownerOnly?: boolean;
}

export const CommandPermissions = Reflector.createDecorator<CommandPermissionsOptions>();
