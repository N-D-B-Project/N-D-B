import type { Emoji, Message, Role, TextChannel } from "discord.js";

export enum REACTION_OPTIONS {
	_1 = 1,
	_2 = 2,
	_3 = 3,
	_4 = 4,
	_5 = 5,
	_6 = 6,
}

export interface IReaction {
	channel: TextChannel["id"];
	message: Message["id"];
	role: Role["id"];
	emoji: Emoji["id"] | Emoji["identifier"];
	option?: REACTION_OPTIONS;
}

export enum CreateStatus {
	UnableToCreate = "UnableToCreate",
	Created = "Created",
}

export enum DeleteStatus {
	UnableToDelete = "UnableToDelete",
	Deleted = "Deleted",
}

export enum UpdateStatus {
	UnableToUpdate = "UnableToUpdate",
	Updated = "Updated",
}
