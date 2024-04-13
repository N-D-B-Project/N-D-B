import { MessageTools } from "@/modules/bot/commands/Message";
import { Config } from "@/modules/shared/config/types";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbedBuilder, Message, TextChannel, channelMention, roleMention } from "discord.js";
import { Context } from "../commands/Commands.context";
import type { IReactionRolesEmbeds } from "./interfaces";
import type { IReaction, REACTION_OPTIONS } from "./types";

@Injectable()
export class ReactionRolesEmbeds implements IReactionRolesEmbeds {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
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
				await this.translate.getTranslation(
					"ReactionRoles/CreateReaction:Channel:Invalid",
					context.guild.preferredLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
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
				await this.translate.getTranslation("ReactionRoles/CreateReaction:ID:Invalid", context.guild.preferredLocale, {
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
				await this.translate.getTranslation("ReactionRoles/CreateReaction:ID:NotFound", context.guild.preferredLocale, {
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
				await this.translate.getTranslation(
					"ReactionRoles/CreateReaction:Role:Invalid",
					context.guild.preferredLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
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
				await this.translate.getTranslation(
					"ReactionRoles/CreateReaction:Emoji:Invalid",
					context.guild.preferredLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
			);
	}

	public async ReactionRoleCreatedEmbed(
		context: Context,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: await this.translate.getTranslation(
					"ReactionRoles/CreateReaction:Embed:Author",
					context.guild.preferredLocale,
				),
				iconURL: context.guild.iconURL(),
			})
			.setColor("#00c26f")
			.addFields([
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/CreateReaction:Embed:Fields:1",
						context.guild.preferredLocale,
					),
					value: channelMention(Channel),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/CreateReaction:Embed:Fields:2",
						context.guild.preferredLocale,
					),
					value: Emoji,
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/CreateReaction:Embed:Fields:3",
						context.guild.preferredLocale,
					),
					value: String(Option),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/CreateReaction:Embed:Fields:4",
						context.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"ReactionRoles/CreateReaction:Embed:Fields:Content:4",
						context.guild.preferredLocale,
						{
							MsgIdURL: (await MessageTools.get((await context.guild.channels.fetch(Channel)) as TextChannel, Message))
								.url,
						},
					),
				},
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/CreateReaction:Embed:Fields:5",
						context.guild.preferredLocale,
					),
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
				await this.translate.getTranslation("ReactionRoles/DeleteReaction:Removed", context.guild.preferredLocale, {
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
			.setDescription(
				await this.translate.getTranslation(
					"ReactionRoles/UpdateReaction:Embed:Description",
					context.guild.preferredLocale,
				),
			)
			.addFields(
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/UpdateReaction:Embed:Fields:1",
						context.guild.preferredLocale,
					),
					value: channelMention(Channel),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/UpdateReaction:Embed:Fields:2",
						context.guild.preferredLocale,
					),
					value: Emoji,
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/UpdateReaction:Embed:Fields:3",
						context.guild.preferredLocale,
					),
					value: await this.translate.getTranslation(
						"ReactionRoles/UpdateReaction:Embed:Fields:Content:3",
						context.guild.preferredLocale,
						{
							MsgIdURL: (await ((await context.guild.channels.fetch(Channel)) as TextChannel).messages.fetch(Message))
								.url,
						},
					),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/UpdateReaction:Embed:Fields:4",
						context.guild.preferredLocale,
					),
					value: roleMention(Role),
					inline: true,
				},
				{
					name: await this.translate.getTranslation(
						"ReactionRoles/UpdateReaction:Embed:Fields:5",
						context.guild.preferredLocale,
					),
					value: newOption.toString(),
					inline: true,
				},
			)

			.setFooter({
				text: await this.translate.getTranslation(
					"ReactionRoles/UpdateReaction:Embed:Footer",
					context.guild.preferredLocale,
				),
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
			.setTitle(
				await this.translate.getTranslation(
					"ReactionRoles/DeleteAllReactions:Embed:Title",
					context.guild.preferredLocale,
				),
			)
			.setAuthor({
				name: context.author.username,
				iconURL: context.author.displayAvatarURL(),
			})
			.setDescription(
				await this.translate.getTranslation(description, context.guild.preferredLocale, {
					NUMBER: String(ReactionCount),
				}),
			)
			.setColor(color);
	}

	public async UnableToCreateReactionRoleEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.translate.getTranslation(
					"ReactionRoles/CreateReaction:UnableToCreate",
					context.guild.preferredLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
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
				await this.translate.getTranslation(
					"ReactionRoles/DeleteReaction:UnableToDelete",
					context.guild.preferredLocale,
					{
						success: this.config.get<Config["Emojis"]>("Emojis").accept,
						URL: MsgID.url,
					},
				),
			);
	}

	public async UnableToDeleteAllReactionRoleEmbed(context: Context): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.translate.getTranslation(
					"ReactionRoles/DeleteAllReaction:UnableToDelete",
					context.guild.preferredLocale,
				),
			);
	}

	public async UnableToUpdateReactionRoleEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: context.author.tag,
				iconURL: context.author.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				await this.translate.getTranslation(
					"ReactionRoles/UpdateReaction:UnableToUpdate",
					context.guild.preferredLocale,
					{
						success: this.config.get<Config["Emojis"]>("Emojis").accept,
						URL: MsgID.url,
					},
				),
			);
	}
}
