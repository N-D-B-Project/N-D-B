import type { Guild, TextChannel } from "discord.js";
import type { ReactionRolesEntity } from "../entities/ReactionRole.entity";
import type {
	CreateStatus,
	DeleteStatus,
	IReaction,
	REACTION_OPTIONS,
	UpdateStatus,
} from "../types";

export interface IReactionRolesRepository {
	getAll(guild: Guild): Promise<ReactionRolesEntity[]>;
	getOne(guild: Guild, reaction: IReaction): Promise<ReactionRolesEntity>;
	getInChannel(
		guild: Guild,
		channel: TextChannel,
	): Promise<ReactionRolesEntity[]>;
	create(guild: Guild, reaction: IReaction): Promise<{ status: CreateStatus }>;
	delete(
		guild: Guild,
		{ channel, message, role, emoji }: IReaction,
	): Promise<{ status: DeleteStatus }>;
	deleteMany(guild: Guild): Promise<{ status: DeleteStatus; count: number }>;
	update(
		guild: Guild,
		reaction: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: UpdateStatus;
		oldOption?: REACTION_OPTIONS;
	}>;
}
