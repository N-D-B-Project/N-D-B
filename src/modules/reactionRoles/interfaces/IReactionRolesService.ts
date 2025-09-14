import type {
	Client,
	CommandInteraction,
	Guild,
	Message,
	Role,
	TextChannel,
} from "discord.js";
import type { ReactionRolesEntity } from "../entities/ReactionRole.entity";
import type {
	CreateStatus,
	DeleteStatus,
	IReaction,
	REACTION_OPTIONS,
	UpdateStatus,
} from "../types";
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
		{ channel, message, role, emoji, option }: IReaction,
	): Promise<ReactionRolesEntity>;
	Create(
		guild: Guild,
		{ channel, message, role, emoji, option }: IReaction,
	): Promise<{ status: CreateStatus }>;
	Delete(
		guild: Guild,
		{ channel, message, role, emoji }: IReaction,
	): Promise<{ status: DeleteStatus }>;
	DeleteAll(guild: Guild): Promise<{ status: DeleteStatus; count: number }>;
	Update(
		guild: Guild,
		{ channel, message, role, emoji, option }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: UpdateStatus;
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
