import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import type { PermissionResolvable } from "discord.js";
import { CommandPermissionsGuard } from "../guards";

export interface CommandPermissionsOptions {
	user: PermissionResolvable[];
	bot: PermissionResolvable[];
	guildOnly: boolean;
	testOnly: boolean;
	ownerOnly: boolean;
	guilds?: string[];
}

export const CommandPermissionsKey = "discord::command::__permissions__";

export const CommandPermissions = (options: CommandPermissionsOptions) => {
	return applyDecorators(
		SetMetadata(CommandPermissionsKey, options),
		UseGuards(CommandPermissionsGuard),
	);
};
