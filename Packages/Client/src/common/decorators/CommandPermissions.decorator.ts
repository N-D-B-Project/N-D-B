import { Reflector } from "@nestjs/core";
import { PermissionResolvable } from "discord.js";

interface CommandPermissionsOptions {
	user: Array<PermissionResolvable>;
	bot: Array<PermissionResolvable>;
	guildOnly?: boolean;
	ownerOnly?: boolean;
}

export const CommandPermissions = Reflector.createDecorator<CommandPermissionsOptions>();
