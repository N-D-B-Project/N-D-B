import { BaseMessageOptions, EmbedBuilder, PermissionResolvable, SlashCommandBuilder } from "discord.js";

export type Content = string | EmbedBuilder | BaseMessageOptions;

export interface LegacyCommandOptions {
	name: string;
	aliases?: Array<string>;
	description: string;
	usage: string;
	args?: {
		min: number;
		max: number;
	};
}

export interface SlashCommandOptions {
	data?: Partial<SlashCommandBuilder>;
	deployMode?: "Test" | "Guild" | "Global";
	type: "Main" | "Sub" | "Group";
	name?: string;
}

export interface CommandConfigOptions {
	category: string;
	disable?: boolean;
	cooldown?: number;
}

export interface CommandPermissionsOptions {
	user: Array<PermissionResolvable>;
	bot: Array<PermissionResolvable>;
	guildOnly?: boolean;
	ownerOnly?: boolean;
}
