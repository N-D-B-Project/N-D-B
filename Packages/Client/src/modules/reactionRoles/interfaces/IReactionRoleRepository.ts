import { ReactionRolesEntity } from "@/modules/database/entities";
import { Guild, TextChannel } from "discord.js";
import { REACTION_OPTIONS, iReaction } from "../types";

export interface IReactionRolesRepository {
	getAll(guild: Guild): Promise<Array<ReactionRolesEntity>>;
	getOne(guild: Guild, { Channel, Message, Role, Emoji, Option }: iReaction): Promise<ReactionRolesEntity>;
	getInChannel(guild: Guild, channel: TextChannel): Promise<Array<ReactionRolesEntity>>;
	create(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: iReaction,
	): Promise<{ status: "UnableToCreate" | "Created" }>;
	delete(guild: Guild, { Channel, Message, Role, Emoji }: iReaction): Promise<{ status: "UnableToDelete" | "Deleted" }>;
	deleteMany(guild: Guild): Promise<{ status: "UnableToDelete" | "Deleted"; count: number }>;
	update(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: iReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: "UnableToUpdate" | "Updated";
		oldOption?: REACTION_OPTIONS;
	}>;
}
