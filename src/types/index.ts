export * from "./reaction-roles";
export * from "./interfaces";
export * from "./constants"

import type { BaseMessageOptions, EmbedBuilder } from "discord.js";

export type Content = string | EmbedBuilder | BaseMessageOptions;

export enum DatabaseStatus {
	Created = 0,
	Error = 1,
}
