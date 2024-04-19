import { MessageTools } from "@/modules/bot/commands/Message";
import { Config } from "@/modules/shared/config/types";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandInteraction, EmbedBuilder, Message, TextChannel, channelMention, roleMention } from "discord.js";
import type { IReactionRolesEmbeds } from "./interfaces";
import type { IReaction, REACTION_OPTIONS } from "./types";

@Injectable()
export class ReactionRolesEmbeds implements IReactionRolesEmbeds {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly config: ConfigService,
	) {}

	public async InvalidChannelEmbed(interaction: CommandInteraction): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.CreateReaction.Channel.Invalid", interaction.guildLocale, {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async InvalidIDEmbed(interaction: CommandInteraction): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.CreateReaction.ID.Invalid", interaction.guildLocale, {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async MessageNotFoundEmbed(interaction: CommandInteraction): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.CreateReaction.ID.NotFound", interaction.guildLocale, {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async InvalidRoleEmbed(interaction: CommandInteraction): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.CreateReaction.Role.Invalid", interaction.guildLocale, {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async InvalidEmojiEmbed(interaction: CommandInteraction): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.CreateReaction.Emoji.Invalid", interaction.guildLocale, {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async ReactionRoleCreatedEmbed(
		interaction: CommandInteraction,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: this.translate.getTranslation("ReactionRoles.CreateReaction.Embed.Author", interaction.guildLocale),
				iconURL: interaction.guild.iconURL(),
			})
			.setColor("#00c26f")
			.addFields([
				{
					name: this.translate.getTranslation("ReactionRoles.CreateReaction.Embed.Fields.1", interaction.guildLocale),
					value: channelMention(Channel),
					inline: true,
				},
				{
					name: this.translate.getTranslation("ReactionRoles.CreateReaction.Embed.Fields.2", interaction.guildLocale),
					value: Emoji,
					inline: true,
				},
				{
					name: this.translate.getTranslation("ReactionRoles.CreateReaction.Embed.Fields.3", interaction.guildLocale),
					value: String(Option),
					inline: true,
				},
				{
					name: this.translate.getTranslation("ReactionRoles.CreateReaction.Embed.Fields.4", interaction.guildLocale),
					value: this.translate.getTranslation(
						"ReactionRoles.CreateReaction.Embed.Fields.Content.4",
						interaction.guildLocale,
						{
							MsgIdURL: (
								await MessageTools.get((await interaction.guild.channels.fetch(Channel)) as TextChannel, Message)
							).url,
						},
					),
				},
				{
					name: this.translate.getTranslation("ReactionRoles.CreateReaction.Embed.Fields.5", interaction.guildLocale),
					value: roleMention(Role),
				},
			]);
	}

	public async ReactionRoleRemovedEmbed(interaction: CommandInteraction, MsgID: Message): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.DeleteReaction.Removed", interaction.guildLocale, {
					success: this.config.get<Config["Emojis"]>("Emojis").accept,
					URL: MsgID.url,
				}),
			);
	}

	public async ReactionRoleUpdatedEmbed(
		interaction: CommandInteraction,
		{ Channel, Message, Role, Emoji }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.UpdateReaction.Embed.Description", interaction.guildLocale),
			)
			.addFields(
				{
					name: this.translate.getTranslation("ReactionRoles.UpdateReaction.Embed.Fields.1", interaction.guildLocale),
					value: channelMention(Channel),
					inline: true,
				},
				{
					name: this.translate.getTranslation("ReactionRoles.UpdateReaction.Embed.Fields.2", interaction.guildLocale),
					value: Emoji,
					inline: true,
				},
				{
					name: this.translate.getTranslation("ReactionRoles.UpdateReaction.Embed.Fields.3", interaction.guildLocale),
					value: this.translate.getTranslation(
						"ReactionRoles.UpdateReaction.Embed.Fields.Content.3",
						interaction.guildLocale,
						{
							MsgIdURL: (
								await ((await interaction.guild.channels.fetch(Channel)) as TextChannel).messages.fetch(Message)
							).url,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation("ReactionRoles.UpdateReaction.Embed.Fields.4", interaction.guildLocale),
					value: roleMention(Role),
					inline: true,
				},
				{
					name: this.translate.getTranslation("ReactionRoles.UpdateReaction.Embed.Fields.5", interaction.guildLocale),
					value: newOption.toString(),
					inline: true,
				},
			)

			.setFooter({
				text: this.translate.getTranslation("ReactionRoles.UpdateReaction.Embed.Footer", interaction.guildLocale),
			});
	}

	public async ReactionRoleDeleteAllEmbed(
		interaction: CommandInteraction,
		status: "Confirm" | "Cancel" | "Success",
		ReactionCount: number | null,
	): Promise<EmbedBuilder> {
		let description: string;
		let color: number;
		switch (status) {
			case "Confirm":
				description = "ReactionRoles.DeleteAllReactions.Embed.Description.Confirm";
				color = 0x00c26f;
				break;
			case "Cancel":
				description = "ReactionRoles.DeleteAllReactions.Embed.Description.Cancel";
				color = 0xc20e00;
				break;
			case "Success":
				description = "ReactionRoles.DeleteAllReactions.Embed.Description.Success";
				color = 0x00c26f;
				break;
		}
		return new EmbedBuilder()
			.setTitle(this.translate.getTranslation("ReactionRoles.DeleteAllReactions.Embed.Title", interaction.guildLocale))
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setDescription(
				this.translate.getTranslation(description, interaction.guildLocale, {
					NUMBER: String(ReactionCount),
				}),
			)
			.setColor(color);
	}

	public async UnableToCreateReactionRoleEmbed(interaction: CommandInteraction): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.CreateReaction.UnableToCreate", interaction.guildLocale, {
					fail: this.config.get<Config["Emojis"]>("Emojis").fail,
				}),
			);
	}

	public async UnableToDeleteReactionRoleEmbed(interaction: CommandInteraction, MsgID: Message): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.DeleteReaction.UnableToDelete", interaction.guildLocale, {
					success: this.config.get<Config["Emojis"]>("Emojis").accept,
					URL: MsgID.url,
				}),
			);
	}

	public async UnableToDeleteAllReactionRoleEmbed(interaction: CommandInteraction): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.DeleteAllReaction.UnableToDelete", interaction.guildLocale),
			);
	}

	public async UnableToUpdateReactionRoleEmbed(interaction: CommandInteraction, MsgID: Message): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation("ReactionRoles.UpdateReaction.UnableToUpdate", interaction.guildLocale, {
					success: this.config.get<Config["Emojis"]>("Emojis").accept,
					URL: MsgID.url,
				}),
			);
	}
}
