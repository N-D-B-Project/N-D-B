import { MessageTools } from "@/modules/commands/Message";
import type { Config } from "@/modules/config/types";
import {
	LOCALIZATION_ADAPTER,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@nestjs/config";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import {
	Client,
	type CommandInteraction,
	EmbedBuilder,
	type Message,
	type MessageReaction,
	PartialMessageReaction,
	PartialUser,
	Role,
	type TextChannel,
	type User,
	channelMention,
	roleMention,
} from "discord.js";
import type { IReactionRolesEmbeds } from "./interfaces";
import type { IReaction, REACTION_OPTIONS } from "./types";

@Injectable()
export class ReactionRolesEmbeds implements IReactionRolesEmbeds {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		private readonly config: ConfigService,
		private readonly client: Client,
	) {}

	public async InvalidChannelEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.create.Channel.Invalid",
					interaction.guildLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
			);
	}

	public async InvalidIDEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.create.ID.Invalid",
					interaction.guildLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
			);
	}

	public async MessageNotFoundEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.create.ID.NotFound",
					interaction.guildLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
			);
	}

	public async InvalidRoleEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.create.Role.Invalid",
					interaction.guildLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
			);
	}

	public async InvalidEmojiEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.id,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.create.Emoji.Invalid",
					interaction.guildLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
			);
	}

	public async ReactionRoleCreatedEmbed(
		interaction: CommandInteraction,
		reaction: IReaction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: this.translate.getTranslation(
					"ReactionRoles.create.Embed.Author",
					interaction.guildLocale,
				),
				iconURL: interaction.guild.iconURL(),
			})
			.setColor("#00c26f")
			.addFields([
				{
					name: this.translate.getTranslation(
						"ReactionRoles.create.Embed.Fields.1",
						interaction.guildLocale,
					),
					value: channelMention(reaction.channel),
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"ReactionRoles.create.Embed.Fields.2",
						interaction.guildLocale,
					),
					value: reaction.emoji,
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"ReactionRoles.create.Embed.Fields.3",
						interaction.guildLocale,
					),
					value: String(reaction.option),
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"ReactionRoles.create.Embed.Fields.4",
						interaction.guildLocale,
					),
					value: this.translate.getTranslation(
						"ReactionRoles.create.Embed.Fields.Content.4",
						interaction.guildLocale,
						{
							MsgIdURL: (
								await MessageTools.get(
									(await interaction.guild.channels.fetch(
										reaction.channel,
									)) as TextChannel,
									reaction.message,
								)
							).url,
						},
					),
				},
				{
					name: this.translate.getTranslation(
						"ReactionRoles.create.Embed.Fields.5",
						interaction.guildLocale,
					),
					value: roleMention(reaction.role),
				},
			]);
	}

	public async ReactionRoleRemovedEmbed(
		interaction: CommandInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.delete.Removed",
					interaction.guildLocale,
					{
						success: this.config.get<Config["Emojis"]>("Emojis").accept,
						URL: MsgID.url,
					},
				),
			);
	}

	public async ReactionRoleUpdatedEmbed(
		interaction: CommandInteraction,
		{ channel, message, role, emoji }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.edit.Embed.Description",
					interaction.guildLocale,
				),
			)
			.addFields(
				{
					name: this.translate.getTranslation(
						"ReactionRoles.edit.Embed.Fields.1",
						interaction.guildLocale,
					),
					value: channelMention(channel),
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"ReactionRoles.edit.Embed.Fields.2",
						interaction.guildLocale,
					),
					value: emoji,
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"ReactionRoles.edit.Embed.Fields.3",
						interaction.guildLocale,
					),
					value: this.translate.getTranslation(
						"ReactionRoles.edit.Embed.Fields.Content.3",
						interaction.guildLocale,
						{
							MsgIdURL: (
								await (
									(await interaction.guild.channels.fetch(
										channel,
									)) as TextChannel
								).messages.fetch(message)
							).url,
						},
					),
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"ReactionRoles.edit.Embed.Fields.4",
						interaction.guildLocale,
					),
					value: roleMention(role),
					inline: true,
				},
				{
					name: this.translate.getTranslation(
						"ReactionRoles.edit.Embed.Fields.5",
						interaction.guildLocale,
					),
					value: newOption.toString(),
					inline: true,
				},
			)

			.setFooter({
				text: this.translate.getTranslation(
					"ReactionRoles.edit.Embed.Footer",
					interaction.guildLocale,
				),
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
				description = "ReactionRoles.deleteall.Embed.Description.Confirm";
				color = 0x00c26f;
				break;
			case "Cancel":
				description = "ReactionRoles.deleteall.Embed.Description.Cancel";
				color = 0xc20e00;
				break;
			case "Success":
				description = "ReactionRoles.deleteall.Embed.Description.Success";
				color = 0x00c26f;
				break;
		}
		return new EmbedBuilder()
			.setTitle(
				this.translate.getTranslation(
					"ReactionRoles.deleteall.Embed.Title",
					interaction.guildLocale,
				),
			)
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

	public async UnableToCreateReactionRoleEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.create.UnableToCreate",
					interaction.guildLocale,
					{
						fail: this.config.get<Config["Emojis"]>("Emojis").fail,
					},
				),
			);
	}

	public async UnableToDeleteReactionRoleEmbed(
		interaction: CommandInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.delete.UnableToDelete",
					interaction.guildLocale,
					{
						success: this.config.get<Config["Emojis"]>("Emojis").accept,
						URL: MsgID.url,
					},
				),
			);
	}

	public async UnableToDeleteAllReactionRoleEmbed(
		interaction: CommandInteraction,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.deleteall.UnableToDelete",
					interaction.guildLocale,
				),
			);
	}

	public async UnableToUpdateReactionRoleEmbed(
		interaction: CommandInteraction,
		MsgID: Message,
	): Promise<EmbedBuilder> {
		return new EmbedBuilder()
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setDescription(
				this.translate.getTranslation(
					"ReactionRoles.edit.UnableToUpdate",
					interaction.guildLocale,
					{
						success: this.config.get<Config["Emojis"]>("Emojis").accept,
						URL: MsgID.url,
					},
				),
			);
	}

	public async EventCooldownEmbed(
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		timer: number,
		channel: string,
		message: string,
	): Promise<EmbedBuilder> {
		const guild = reaction.message.guild;
		return new EmbedBuilder()
			.setAuthor({
				name: user.username,
				iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
			})
			.setTitle(
				this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.Cooldown.Title",
					guild.preferredLocale,
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.Cooldown.Description",
					guild.preferredLocale,
					{
						GUILD: guild.name,
						TIMER: String(timer),
					},
				),
			)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Events.ReactionRoleAdd-Remove.GlobalField.1",
						guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Events.ReactionRoleAdd-Remove.GlobalField.Content",
						guild.preferredLocale,
						{
							URL: `https://discord.com/channels/${guild.id}/${channel}/${message}`,
						},
					),
				},
			])
			.setFooter({
				text: this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.GlobalFooter",
					guild.preferredLocale,
				),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setTimestamp();
	}

	public async EventAddEmbed(
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		role: Role,
		channel: string,
		message: string,
	): Promise<EmbedBuilder> {
		const guild = reaction.message.guild;

		return new EmbedBuilder()
			.setAuthor({
				name: user.username,
				iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
			})
			.setTitle(
				this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.Add.Title",
					guild.preferredLocale,
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.Add.Description",
					guild.preferredLocale,
					{
						ROLE: role.name,
						GUILD: guild.name,
					},
				),
			)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Events.ReactionRoleAdd-Remove.GlobalField.1",
						guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Events.ReactionRoleAdd-Remove.GlobalField.Content",
						guild.preferredLocale,

						{
							URL: `https://discord.com/channels/${guild.id}/${channel}/${message}`,
						},
					),
				},
			])
			.setFooter({
				text: this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.GlobalFooter",
					guild.preferredLocale,
				),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTimestamp();
	}

	public async EventRemoveEmbed(
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		role: Role,
		channel: string,
		message: string,
	): Promise<EmbedBuilder> {
		const guild = reaction.message.guild;

		return new EmbedBuilder()
			.setAuthor({
				name: user.username,
				iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
			})
			.setTitle(
				this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.Remove.Title",
					guild.preferredLocale,
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.Remove.Description",
					guild.preferredLocale,
					{
						ROLE: role.name,
						GUILD: guild.name,
					},
				),
			)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Events.ReactionRoleAdd-Remove.GlobalField.1",
						guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Events.ReactionRoleAdd-Remove.GlobalField.Content",
						guild.preferredLocale,
						{
							URL: `https://discord.com/channels/${guild.id}/${channel}/${message}`,
						},
					),
				},
			])
			.setFooter({
				text: this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.GlobalFooter",
					guild.preferredLocale,
				),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setColor("#00c26f")
			.setTimestamp();
	}

	public async EventErrorEmbed(
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		role: Role,
		channel: string,
		message: string,
	): Promise<EmbedBuilder> {
		const guild = reaction.message.guild;

		return new EmbedBuilder()
			.setAuthor({
				name: user.username,
				iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
			})
			.setTitle(
				this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.Error.Title",
					guild.preferredLocale,
				),
			)
			.setDescription(
				this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.Error.Description",
					guild.preferredLocale,
					{
						ROLE: role.name,
						GUILD: guild.name,
					},
				),
			)
			.addFields([
				{
					name: this.translate.getTranslation(
						"Events.ReactionRoleAdd-Remove.GlobalField.1",
						guild.preferredLocale,
					),
					value: this.translate.getTranslation(
						"Events.ReactionRoleAdd-Remove.GlobalField.Content",
						guild.preferredLocale,

						{
							URL: `https://discord.com/channels/${guild.id}/${channel}/${message}`,
						},
					),
				},
			])
			.setFooter({
				text: this.translate.getTranslation(
					"Events.ReactionRoleAdd-Remove.GlobalFooter",
					guild.preferredLocale,
				),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setColor("#c20e00")
			.setTimestamp();
	}
}
