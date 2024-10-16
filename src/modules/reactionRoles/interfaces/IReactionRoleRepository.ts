import type { Guild, TextChannel } from "discord.js";
import type { ReactionRolesEntity } from "../entities/ReactionRole.entity";
import type { IReaction, REACTION_OPTIONS } from "../types";

export interface IReactionRolesRepository {
	getAll(guild: Guild): Promise<ReactionRolesEntity[]>;
	getOne(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<ReactionRolesEntity>;
	getInChannel(
		guild: Guild,
		channel: TextChannel,
	): Promise<ReactionRolesEntity[]>;
	create(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<{ status: "UnableToCreate" | "Created" }>;
	delete(
		guild: Guild,
		{ Channel, Message, Role, Emoji }: IReaction,
	): Promise<{ status: "UnableToDelete" | "Deleted" }>;
	deleteMany(
		guild: Guild,
	): Promise<{ status: "UnableToDelete" | "Deleted"; count: number }>;
	update(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: "UnableToUpdate" | "Updated";
		oldOption?: REACTION_OPTIONS;
	}>;
}
