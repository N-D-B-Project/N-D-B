import { Context } from "@/modules/commands/Commands.context";
import { EmbedBuilder, Message } from "discord.js";
import type { IReaction, REACTION_OPTIONS } from "../types";

export interface IReactionRolesEmbeds {
	InvalidChannelEmbed(context: Context): Promise<EmbedBuilder>;
	InvalidIDEmbed(context: Context): Promise<EmbedBuilder>;
	MessageNotFoundEmbed(context: Context): Promise<EmbedBuilder>;
	InvalidRoleEmbed(context: Context): Promise<EmbedBuilder>;
	InvalidEmojiEmbed(context: Context): Promise<EmbedBuilder>;
	ReactionRoleCreatedEmbed(
		context: Context,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<EmbedBuilder>;
	ReactionRoleRemovedEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder>;
	ReactionRoleUpdatedEmbed(
		context: Context,
		{ Channel, Message, Role, Emoji }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<EmbedBuilder>;
	ReactionRoleDeleteAllEmbed(
		context: Context,
		status: "Confirm" | "Cancel" | "Success",
		ReactionCount: number | null,
	): Promise<EmbedBuilder>;
	UnableToCreateReactionRoleEmbed(context: Context): Promise<EmbedBuilder>;
	UnableToDeleteReactionRoleEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder>;
	UnableToDeleteAllReactionRoleEmbed(context: Context): Promise<EmbedBuilder>;
	UnableToUpdateReactionRoleEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder>;
}
