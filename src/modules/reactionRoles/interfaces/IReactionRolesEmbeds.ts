import type {
	CommandInteraction,
	EmbedBuilder,
	Message,
	MessageComponentInteraction,
	MessageReaction,
	PartialMessageReaction,
	PartialUser,
	Role,
	User,
} from "discord.js";
import type { IReaction, REACTION_OPTIONS } from "../types";

type AnyInteraction = CommandInteraction | MessageComponentInteraction;

export interface IReactionRolesEmbeds {
	MessageNotFoundEmbed(interaction: AnyInteraction): Promise<EmbedBuilder>;
	ReactionRoleCreatedEmbed(
		interaction: AnyInteraction,
		{ channel, message, role, emoji, option }: IReaction,
	): Promise<EmbedBuilder>;
	ReactionRoleRemovedEmbed(
		interaction: AnyInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder>;
	ReactionRoleUpdatedEmbed(
		interaction: AnyInteraction,
		{ channel, message, role, emoji }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<EmbedBuilder>;
	ReactionRoleDeleteAllEmbed(
		interaction: AnyInteraction,
		status: "Confirm" | "Cancel" | "Success",
		ReactionCount: number | null,
	): Promise<EmbedBuilder>;
	UnableToCreateReactionRoleEmbed(
		interaction: AnyInteraction,
	): Promise<EmbedBuilder>;
	UnableToDeleteReactionRoleEmbed(
		interaction: AnyInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder>;
	UnableToDeleteAllReactionRoleEmbed(
		interaction: AnyInteraction,
	): Promise<EmbedBuilder>;
	UnableToUpdateReactionRoleEmbed(
		interaction: AnyInteraction,
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
