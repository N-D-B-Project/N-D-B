import {
	Client,
	CommandInteraction,
	Guild,
	Message,
	Role,
	TextChannel,
} from "discord.js";
import { ReactionRolesEntity } from "../entities/ReactionRole.entity";
import type { IReaction, REACTION_OPTIONS } from "../types";
import type { IReactionRolesEmbeds } from "./IReactionRolesEmbeds";

export interface IReactionRolesService {
	Embeds(): Promise<IReactionRolesEmbeds>;
	getAll(guild: Guild): Promise<ReactionRolesEntity[]>;
	getInChannel(
		guild: Guild,
		channel: TextChannel,
	): Promise<ReactionRolesEntity[]>;
	getOne(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<ReactionRolesEntity>;
	Create(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<{ status: "UnableToCreate" | "Created" }>;
	Delete(
		guild: Guild,
		{ Channel, Message, Role, Emoji }: IReaction,
	): Promise<{ status: "UnableToDelete" | "Deleted" }>;
	DeleteAll(
		guild: Guild,
	): Promise<{ status: "UnableToDelete" | "Deleted"; count: number }>;
	Update(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: "UnableToUpdate" | "Updated";
		oldOption?: REACTION_OPTIONS;
	}>;

	CheckParams(
		client: Client,
		interaction: CommandInteraction,
		channel: TextChannel,
		messageId: string,
		message: Message,
		role: Role,
		emoji: string,
	);
}
