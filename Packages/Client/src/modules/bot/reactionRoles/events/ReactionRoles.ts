import { MessageTools } from "@/modules/bot/commands/Message";
import type { IDatabaseService } from "@/modules/shared/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
import { Client, EmbedBuilder, roleMention } from "discord.js";
import { Context, ContextOf, On } from "necord";
import type { IReactionRolesService } from "../interfaces";
import { ReactionRoles } from "../types/constants";

@Injectable()
export class ReactionRolesEvents {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(ReactionRoles.Service) private readonly reactionRoles: IReactionRolesService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly client: Client,
	) {}

	@On("messageReactionAdd")
	public async onReactionRolesAdd(@Context() [reaction, user]: ContextOf<"messageReactionAdd">) {
		if (user === this.client.user) return;
		const TIMER: number = 10 * 1000;
		const ReactionCooldown = new Set();
		const ClientCooldown = new Set();
		const data = await this.reactionRoles.getAll(reaction.message.guild);
		const GuildData = await this.database.GuildRepo().get(reaction.message.guildId);
		const Guild = reaction.message.guild;
		const Member = Guild.members.cache.get(user.id);

		if (!data) return;

		for (const Data of data) {
			const SplitEmoji = Data.Emoji.replace("<:", "").replace(">", "");

			if (reaction.emoji.identifier === SplitEmoji && reaction.message.id === Data.Message) {
				const Role = Guild.roles.cache.get(Data.Role);
				const Message = Data.Message;
				const Channel = Data.Channel;
				const Emoji = Guild.emojis.cache.get(Data.Emoji);
				const Option = Data.Option;
				if (ClientCooldown.has(reaction.message.guildId)) return;

				const CooldownEmbed = new EmbedBuilder()
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
					})
					.setTitle(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Cooldown.Title",
							reaction.message.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Cooldown.Description",
							reaction.message.guild.preferredLocale,
							{
								GUILD: Guild.name,
								TIMER: String(TIMER),
							},
						),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.1",
								reaction.message.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.Content",
								reaction.message.guild.preferredLocale,
								{
									URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
								},
							),
						},
					])
					.setFooter({
						text: this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.GlobalFooter",
							reaction.message.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setColor("#c20e00")
					.setTimestamp();
				const AddEmbed = new EmbedBuilder()
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
					})
					.setTitle(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Add.Title",
							reaction.message.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Add.Description",
							reaction.message.guild.preferredLocale,
							{
								ROLE: Role.name,
								GUILD: Guild.name,
							},
						),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.1",
								reaction.message.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.Content",
								reaction.message.guild.preferredLocale,

								{
									URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
								},
							),
						},
					])
					.setFooter({
						text: this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.GlobalFooter",
							reaction.message.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setColor("#00c26f")
					.setTimestamp();
				const RemoveEmbed = new EmbedBuilder()
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
					})
					.setTitle(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Remove.Title",
							reaction.message.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Remove.Description",
							reaction.message.guild.preferredLocale,
							{
								ROLE: Role.name,
								GUILD: Guild.name,
							},
						),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.1",
								reaction.message.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.Content",
								reaction.message.guild.preferredLocale,
								{
									URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
								},
							),
						},
					])
					.setFooter({
						text: this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.GlobalFooter",
							reaction.message.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setColor("#00c26f")
					.setTimestamp();
				const ErrorEmbed = new EmbedBuilder()
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
					})
					.setTitle(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Error.Title",
							reaction.message.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Error.Description",
							reaction.message.guild.preferredLocale,
							{
								ROLE: Role.name,
								GUILD: Guild.name,
							},
						),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.1",
								reaction.message.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.Content",
								reaction.message.guild.preferredLocale,

								{
									URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
								},
							),
						},
					])
					.setFooter({
						text: this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.GlobalFooter",
							reaction.message.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setColor("#c20e00")
					.setTimestamp();

				if (Option === 1) {
					try {
						if (!Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							await Member.roles
								.add(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.ADD.1",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							if (GuildData.Settings.ReactionDM) {
								MessageTools.send(user, {
									embeds: [AddEmbed],
								}).catch(() => {});
							}
							ReactionCooldown.add(user.id);
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, TIMER);
						}
					} catch (error) {
						ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							ClientCooldown.delete(reaction.message.guildId);
						}, TIMER);
						MessageTools.send(user, {
							embeds: [ErrorEmbed],
						});
						return;
					}
				}

				if (Option === 2) {
					try {
						if (!Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							await Member.roles
								.add(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.ADD.2",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							if (GuildData.Settings.ReactionDM) {
								MessageTools.send(user, { embeds: [AddEmbed] }).catch(() => {});
							}
							ReactionCooldown.add(user.id);
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, TIMER);
						}
					} catch (err) {
						ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							ClientCooldown.delete(reaction.message.guildId);
						}, TIMER);
						MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
						return;
					}
				}

				if (Option === 3) {
					try {
						if (Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							await Member.roles
								.remove(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.REMOVE.3",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							if (GuildData.Settings.ReactionDM) {
								MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(() => {});
							}
							ReactionCooldown.add(user.id);
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, TIMER);
						}
					} catch (err) {
						ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							ClientCooldown.delete(reaction.message.guildId);
						}, TIMER);
						MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
						return;
					}
				}

				if (Option === 4) {
					try {
						if (Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							await Member.roles
								.remove(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.REMOVE.4",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							ReactionCooldown.add(user.id);
							if (GuildData.Settings.ReactionDM) {
								MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(() => {});
							}
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, TIMER);
						}
					} catch (err) {
						ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							ClientCooldown.delete(reaction.message.guildId);
						}, TIMER);
						MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
						return;
					}
				}

				if (Option === 5) {
					try {
						if (Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							await Member.roles.remove(
								Role,
								this.translate.getTranslation(
									"Events.ReactionRoleAdd-Remove.Options.REMOVE.5",
									reaction.message.guild.preferredLocale,
								),
							);
							reaction.message.reactions.cache
								.find((r) => r.emoji.name === Emoji.name)
								.users.remove(user.id)
								.catch(() => {});

							if (GuildData.Settings.ReactionDM) {
								MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(() => {});
							}
							ReactionCooldown.add(user.id);
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, TIMER);
						}
					} catch (err) {
						ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							ClientCooldown.delete(reaction.message.guildId);
						}, TIMER);
						MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
						return;
					}
				}

				if (Option === 6) {
					try {
						if (Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							reaction.message.reactions.cache
								.find((r) => r.emoji.name === Emoji.name)
								.users.remove(user.id)
								.catch(() => {});
							await Member.roles
								.remove(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.REMOVE.6",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});

							ReactionCooldown.add(user.id);
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, TIMER);

							return;
						}
						if (!Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							reaction.message.reactions.cache
								.find((r) => r.emoji.name === Emoji.name)
								.users.remove(user.id)
								.catch(() => {});
							await Member.roles
								.add(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.ADD.6",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});

							if (GuildData.Settings.ReactionDM) {
								MessageTools.send(user, { embeds: [AddEmbed] }).catch(() => {});
							}
							ReactionCooldown.add(user.id);
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, TIMER);
						}
					} catch (err) {
						ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							ClientCooldown.delete(reaction.message.guildId);
						}, 6000);
						MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
						return;
					}
				}
			}
		}
	}

	@On("messageReactionRemove")
	public async onReactionRolesRemove(@Context() [reaction, user]: ContextOf<"messageReactionAdd">) {
		if (user === this.client.user) return;

		const TIMER: number = 10 * 1000;
		const ReactionCooldown = new Set();
		const ClientCooldown = new Set();
		const data = await this.reactionRoles.getAll(reaction.message.guild);
		const GuildData = await this.database.GuildRepo().get(reaction.message.guildId);
		const Member = reaction.message.guild.members.cache.get(user.id);
		const Guild = reaction.message.guild;
		if (!data) return;

		for (const Data of data) {
			const SplitEmoji = Data.Emoji.replace("<:", "").replace(">", "");

			if (reaction.emoji.identifier === SplitEmoji && reaction.message.id === Data.Message) {
				const Role = Guild.roles.cache.get(Data.Role);
				const Message = Data.Message;
				const Channel = Data.Channel;
				const Emoji = Guild.emojis.cache.get(Data.Emoji);
				const Option = Data.Option;

				if (ClientCooldown.has(reaction.message.guildId)) return;

				const CooldownEmbed = new EmbedBuilder()
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
					})
					.setTitle(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd.Remove.Cooldown.Title",
							reaction.message.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Cooldown.Description",
							reaction.message.guild.preferredLocale,
							{
								GUILD: Guild.name,
								TIMER: String(TIMER),
							},
						),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.1",
								reaction.message.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.Content",
								reaction.message.guild.preferredLocale,
								{
									URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
								},
							),
						},
					])
					.setFooter({
						text: this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.GlobalFooter",
							reaction.message.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setColor("#c20e00")
					.setTimestamp();
				const AddEmbed = new EmbedBuilder()
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
					})
					.setTitle(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Add.Title",
							reaction.message.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Add.Description",
							reaction.message.guild.preferredLocale,
							{
								ROLE: roleMention(Role.id),
								GUILD: Guild.name,
							},
						),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove-Remove.GlobalField.1",
								reaction.message.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.Content",
								reaction.message.guild.preferredLocale,

								{
									URL: `https://wwwcom/channels/${Guild.id}/${Channel}/${Message}`,
								},
							),
						},
					])
					.setFooter({
						text: this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.GlobalFooter",
							reaction.message.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setColor("#00c26f")
					.setTimestamp();
				const RemoveEmbed = new EmbedBuilder()
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
					})
					.setTitle(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Remove.Title",
							reaction.message.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Remove.Description",
							reaction.message.guild.preferredLocale,
							{
								ROLE: roleMention(Role.id),
								GUILD: Guild.name,
							},
						),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.1",
								reaction.message.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.Content",
								reaction.message.guild.preferredLocale,
								{
									URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
								},
							),
						},
					])
					.setFooter({
						text: this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.GlobalFooter",
							reaction.message.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setColor("#00c26f")
					.setTimestamp();
				const ErrorEmbed = new EmbedBuilder()
					.setAuthor({
						name: user.username,
						iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
					})
					.setTitle(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Error.Title",
							reaction.message.guild.preferredLocale,
						),
					)
					.setDescription(
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Error.Description",
							reaction.message.guild.preferredLocale,
							{
								ROLE: roleMention(Role.id),
								GUILD: Guild.name,
							},
						),
					)
					.addFields([
						{
							name: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.1",
								reaction.message.guild.preferredLocale,
							),
							value: this.translate.getTranslation(
								"Events.ReactionRoleAdd-Remove.GlobalField.Content",
								reaction.message.guild.preferredLocale,
								{
									URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
								},
							),
						},
					])
					.setFooter({
						text: this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.GlobalFooter",
							reaction.message.guild.preferredLocale,
						),
						iconURL: this.client.user.displayAvatarURL(),
					})
					.setColor("#c20e00")
					.setTimestamp();

				if (Option === 1) {
					try {
						if (Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							await Member.roles
								.remove(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.REMOVE:1",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							ReactionCooldown.add(user.id);
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, 2000);

							if (GuildData.Settings.ReactionDM) {
								if (ClientCooldown.has(reaction.message.guildId)) return;
								MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(() => {});
								ClientCooldown.add(reaction.message.guildId);
								setTimeout(() => {
									ClientCooldown.delete(reaction.message.guildId);
								}, 4000);
							}
						}
					} catch (err) {
						if (ClientCooldown.has(reaction.message.guildId)) return;
						ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							ClientCooldown.delete(reaction.message.guildId);
						}, 6000);
						MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
					}
				}

				if (Option === 4) {
					try {
						if (!Member.roles.cache.find((r) => r.name.toLowerCase() === Role.name.toLowerCase())) {
							await Member.roles
								.add(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.ADD.4",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							if (GuildData.Settings.ReactionDM) {
								MessageTools.send(user, { embeds: [AddEmbed] }).catch(() => {});
							}
							ReactionCooldown.add(user.id);
							setTimeout(() => {
								ReactionCooldown.delete(user.id);
							}, 2000);
						}
					} catch (err) {
						if (ClientCooldown.has(reaction.message.guildId)) return;
						ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							ClientCooldown.delete(reaction.message.guildId);
						}, 6000);
						MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
					}
				}
			}
		}
	}
}
