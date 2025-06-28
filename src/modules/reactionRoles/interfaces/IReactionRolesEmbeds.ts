import type {
	CommandInteraction,
	EmbedBuilder,
	Message,
	MessageReaction,
	PartialMessageReaction,
	PartialUser,
	Role,
	User,
} from "discord.js";
import type { IReaction, REACTION_OPTIONS } from "../types";

export interface IReactionRolesEmbeds {
	InvalidChannelEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	InvalidIDEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	MessageNotFoundEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	InvalidRoleEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	InvalidEmojiEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	ReactionRoleCreatedEmbed(
		interaction: CommandInteraction,
		{ channel, message, role, emoji, option }: IReaction,
	): Promise<EmbedBuilder>;
	ReactionRoleRemovedEmbed(
		interaction: CommandInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder>;
	ReactionRoleUpdatedEmbed(
		interaction: CommandInteraction,
		{ channel, message, role, emoji }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<EmbedBuilder>;
	ReactionRoleDeleteAllEmbed(
		interaction: CommandInteraction,
		status: "Confirm" | "Cancel" | "Success",
		ReactionCount: number | null,
	): Promise<EmbedBuilder>;
	UnableToCreateReactionRoleEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder>;
	UnableToDeleteReactionRoleEmbed(
		interaction: CommandInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder>;
	UnableToDeleteAllReactionRoleEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder>;
	UnableToUpdateReactionRoleEmbed(
		interaction: CommandInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder>;
	EventCooldownEmbed(
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		timer: number,
		channel: string,
		message: string,
	): Promise<EmbedBuilder>;
	EventAddEmbed(
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		role: Role,
		channel: string,
		message: string,
	): Promise<EmbedBuilder>;
	EventRemoveEmbed(
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		role: Role,
		channel: string,
		message: string,
	): Promise<EmbedBuilder>;
	EventErrorEmbed(
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		role: Role,
		channel: string,
		message: string,
	): Promise<EmbedBuilder>;
}
