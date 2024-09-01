import { CommandInteraction, EmbedBuilder, Message } from "discord.js";
import type { IReaction, REACTION_OPTIONS } from "../types";

export interface IReactionRolesEmbeds {
	InvalidChannelEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	InvalidIDEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	MessageNotFoundEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	InvalidRoleEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	InvalidEmojiEmbed(interaction: CommandInteraction): Promise<EmbedBuilder>;
	ReactionRoleCreatedEmbed(
		interaction: CommandInteraction,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<EmbedBuilder>;
	ReactionRoleRemovedEmbed(
		interaction: CommandInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder>;
	ReactionRoleUpdatedEmbed(
		interaction: CommandInteraction,
		{ Channel, Message, Role, Emoji }: IReaction,
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
}
