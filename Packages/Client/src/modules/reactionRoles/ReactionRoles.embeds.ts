import { MessageTools } from "@/modules/commands/Message";
import { Config } from "@/types";
import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbedBuilder, Message, TextChannel, channelMention, roleMention } from "discord.js";
import { Context } from "../commands/Commands.context";
import { IReactionRolesEmbeds } from "./interfaces";
import { IReaction, REACTION_OPTIONS } from "./types";

@Injectable()
export class ReactionRolesEmbeds implements IReactionRolesEmbeds {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly config: ConfigService,
	) {}

	public async InvalidChannelEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.id,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Channel:Invalid", {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async InvalidIDEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.id,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/CreateReaction:ID:Invalid", {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async MessageNotFoundEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.id,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/CreateReaction:ID:NotFound", {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async InvalidRoleEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.id,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Role:Invalid", {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async InvalidEmojiEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.id,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Emoji:Invalid", {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async ReactionRoleCreatedEmbed(
		context: Context,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Embed:Author"),
				iconURL: context.guild.iconURL(),
			})
			.setColor("#00c26f")
			.addFields([
				{
					name: await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Embed:Fields:1"),
					value: channelMention(Channel),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Embed:Fields:2"),
					value: Emoji,
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Embed:Fields:3"),
					value: String(Option),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Embed:Fields:4"),
					value: await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Embed:Fields:Content:4", {
						MsgIdURL: (await MessageTools.get((await context.guild.channels.fetch(Channel)) as TextChannel, Message))
							.url,
					}),
				},
				{
					name: await this.Translate.Guild(context, "ReactionRoles/CreateReaction:Embed:Fields:5"),
					value: roleMention(Role),
				},
			]);
	}

	public async ReactionRoleRemovedEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/DeleteReaction:Removed", {
					success: this.config.get<Config["Emojis"]>("Emojis").accept,
					URL: MsgID.url,
				}),
			);
	}

	public async ReactionRoleUpdatedEmbed(
		context: Context,
		{ Channel, Message, Role, Emoji }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setDescription(await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:Embed:Description"))
			.addFields(
				{
					name: await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:Embed:Fields:1"),
					value: channelMention(Channel),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:Embed:Fields:2"),
					value: Emoji,
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:Embed:Fields:3"),
					value: await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:Embed:Fields:Content:3", {
						MsgIdURL: (await ((await context.guild.channels.fetch(Channel)) as TextChannel).messages.fetch(Message))
							.url,
					}),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:Embed:Fields:4"),
					value: roleMention(Role),
					inline: true,
				},
				{
					name: await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:Embed:Fields:5"),
					value: newOption.toString(),
					inline: true,
				},
			)

			.setFooter({
				text: await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:Embed:Footer"),
			});
	}

	public async ReactionRoleDeleteAllEmbed(
		context: Context,
		status: "Confirm" | "Cancel" | "Success",
		ReactionCount: number | null,
	): Promise<EmbedBuilder> {
		let description: string;
		let color: number;
		switch (status) {
			case "Confirm":
				description = "ReactionRoles/DeleteAllReactions:Embed:Description:Confirm";
				color = 0x00c26f;
				break;
			case "Cancel":
				description = "ReactionRoles/DeleteAllReactions:Embed:Description:Cancel";
				color = 0xc20e00;
				break;
			case "Success":
				description = "ReactionRoles/DeleteAllReactions:Embed:Description:Success";
				color = 0x00c26f;
				break;
		}
		return new EmbedBuilder()
			.setTitle(await this.Translate.Guild(context, "ReactionRoles/DeleteAllReactions:Embed:Title"))
			.setAuthor({
				name: context.author.username,
				iconURL: context.author.displayAvatarURL(),
			})
			.setDescription(
				await this.Translate.Guild(context, description, {
					NUMBER: ReactionCount,
				}),
			)
			.setColor(color);
	}

	//TODO: Fazer esse Embed ser mais bonito
	public async UnableToCreateReactionRoleEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/CreateReaction:UnableToCreate", {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async UnableToDeleteReactionRoleEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/DeleteReaction:UnableToDelete", {
					success: this.config.get<Config["Emojis"]>("Emojis").accept,
					URL: MsgID.url,
				}),
			);
	}

	public async UnableToDeleteAllReactionRoleEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(await this.Translate.Guild(context, "ReactionRoles/DeleteAllReaction:UnableToDelete"));
	}

	public async UnableToUpdateReactionRoleEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.Translate.Guild(context, "ReactionRoles/UpdateReaction:UnableToUpdate", {
					success: this.config.get<Config["Emojis"]>("Emojis").accept,
					URL: MsgID.url,
				}),
			);
	}
}
