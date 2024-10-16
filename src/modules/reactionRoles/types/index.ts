import type { Channel, Emoji, Message, Role, TextChannel } from "discord.js";

export interface ReactionsType {
	message: Message["id"];
	channel: Channel["id"];
	role: Role["id"];
	emoji: Emoji["name"] | Emoji["identifier"];
	option: REACTION_OPTIONS;
}

export enum REACTION_OPTIONS {
	_1 = 1,
	_2 = 2,
	_3 = 3,
	_4 = 4,
	_5 = 5,
	_6 = 6,
}

export enum FetchType {
	All = "All",
	Channel = "Channel",
}

export interface IReactionArray {
	message: string;
	channel: string;
	role: string;
	emoji: string;
	option: number;
}

export interface IReaction {
	Channel: TextChannel["id"];
	Message: Message["id"];
	Role: Role["id"];
	Emoji: Emoji["id"] | Emoji["identifier"];
	Option?: REACTION_OPTIONS;
}
