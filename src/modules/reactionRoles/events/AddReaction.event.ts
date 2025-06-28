import { MessageTools } from "@/modules/commands/Message";
import type { IDatabaseService } from "@/modules/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import {
	LOCALIZATION_ADAPTER,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Client } from "discord.js";
import { Context, type ContextOf, On } from "necord";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../interfaces";
import { ReactionRoles } from "../types/constants";

@Injectable()
export class AddReactionEvent {
	private readonly ReactionCooldown = new Set<string>();
	private readonly ClientCooldown = new Set<string>();
	private readonly TIMER = 10 * 1000;

	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(ReactionRoles.Service)
		private readonly reactionRoles: IReactionRolesService,
		@Inject(ReactionRoles.Embeds) private readonly embeds: IReactionRolesEmbeds,
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		private readonly client: Client,
	) {}

	@On("messageReactionAdd")
	public async onReactionRolesAdd(
		@Context() [reaction, user]: ContextOf<"messageReactionAdd">,
	) {
		if (user === this.client.user) return;
		const reactionsData = await this.reactionRoles.getAll(
			reaction.message.guild,
		);
		const guildData = await this.database
			.GuildRepo()
			.get(reaction.message.guildId);
		const guild = reaction.message.guild;
		const member = guild.members.cache.get(user.id);

		if (!reactionsData) return;

		for (const reactionData of reactionsData) {
			const emoji = reaction.emoji.animated
				? `<a:${reaction.emoji.name}:${reaction.emoji.id}>`
				: `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
			if (
				(emoji === reactionData.emoji ||
					reaction.emoji.name === reactionData.emoji) &&
				reaction.message.id === reactionData.message
			) {
				const Role = guild.roles.cache.get(reactionData.role);
				const {
					message: Message,
					channel: Channel,
					option: Option,
				} = reactionData;
				const Emoji = guild.emojis.cache.get(reactionData.emoji);

				if (this.ClientCooldown.has(reaction.message.guildId)) return;
				if (this.ReactionCooldown.has(user.id)) {
					MessageTools.send(user, {
						embeds: [
							await this.embeds.EventCooldownEmbed(
								user,
								reaction,
								this.TIMER,
								Channel,
								Message,
							),
						],
					});
				}

				if (Option === 1) {
					try {
						if (
							!member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							await member.roles
								.add(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.ADD.1",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							if (guildData.Settings.ReactionDM) {
								MessageTools.send(user, {
									embeds: [
										await this.embeds.EventAddEmbed(
											user,
											reaction,
											Role,
											Channel,
											Message,
										),
									],
								}).catch(() => {});
							}
							this.ReactionCooldown.add(user.id);
							setTimeout(() => {
								this.ReactionCooldown.delete(user.id);
							}, this.TIMER);
						}
					} catch (error) {
						this.ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							this.ClientCooldown.delete(reaction.message.guildId);
						}, this.TIMER);
						MessageTools.send(user, {
							embeds: [
								await this.embeds.EventErrorEmbed(
									user,
									reaction,
									Role,
									Channel,
									Message,
								),
							],
						});
						return;
					}
				}

				if (Option === 2) {
					try {
						if (
							!member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							await member.roles
								.add(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.ADD.2",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							if (guildData.Settings.ReactionDM) {
								MessageTools.send(user, {
									embeds: [
										await this.embeds.EventAddEmbed(
											user,
											reaction,
											Role,
											Channel,
											Message,
										),
									],
								}).catch(() => {});
							}
							this.ReactionCooldown.add(user.id);
							setTimeout(() => {
								this.ReactionCooldown.delete(user.id);
							}, this.TIMER);
						}
					} catch (err) {
						this.ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							this.ClientCooldown.delete(reaction.message.guildId);
						}, this.TIMER);
						MessageTools.send(user, {
							embeds: [
								await this.embeds.EventErrorEmbed(
									user,
									reaction,
									Role,
									Channel,
									Message,
								),
							],
						}).catch(() => {});
						return;
					}
				}

				if (Option === 3) {
					try {
						if (
							member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							await member.roles
								.remove(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.REMOVE.3",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							if (guildData.Settings.ReactionDM) {
								MessageTools.send(user, {
									embeds: [
										await this.embeds.EventRemoveEmbed(
											user,
											reaction,
											Role,
											Channel,
											Message,
										),
									],
								}).catch(() => {});
							}
							this.ReactionCooldown.add(user.id);
							setTimeout(() => {
								this.ReactionCooldown.delete(user.id);
							}, this.TIMER);
						}
					} catch (err) {
						this.ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							this.ClientCooldown.delete(reaction.message.guildId);
						}, this.TIMER);
						MessageTools.send(user, {
							embeds: [
								await this.embeds.EventErrorEmbed(
									user,
									reaction,
									Role,
									Channel,
									Message,
								),
							],
						}).catch(() => {});
						return;
					}
				}

				if (Option === 4) {
					try {
						if (
							member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							await member.roles
								.remove(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.REMOVE.4",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							this.ReactionCooldown.add(user.id);
							if (guildData.Settings.ReactionDM) {
								MessageTools.send(user, {
									embeds: [
										await this.embeds.EventRemoveEmbed(
											user,
											reaction,
											Role,
											Channel,
											Message,
										),
									],
								}).catch(() => {});
							}
							setTimeout(() => {
								this.ReactionCooldown.delete(user.id);
							}, this.TIMER);
						}
					} catch (err) {
						this.ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							this.ClientCooldown.delete(reaction.message.guildId);
						}, this.TIMER);
						MessageTools.send(user, {
							embeds: [
								await this.embeds.EventErrorEmbed(
									user,
									reaction,
									Role,
									Channel,
									Message,
								),
							],
						}).catch(() => {});
						return;
					}
				}

				if (Option === 5) {
					try {
						if (
							member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							await member.roles.remove(
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

							if (guildData.Settings.ReactionDM) {
								MessageTools.send(user, {
									embeds: [
										await this.embeds.EventRemoveEmbed(
											user,
											reaction,
											Role,
											Channel,
											Message,
										),
									],
								}).catch(() => {});
							}
							this.ReactionCooldown.add(user.id);
							setTimeout(() => {
								this.ReactionCooldown.delete(user.id);
							}, this.TIMER);
						}
					} catch (err) {
						this.ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							this.ClientCooldown.delete(reaction.message.guildId);
						}, this.TIMER);
						MessageTools.send(user, {
							embeds: [
								await this.embeds.EventErrorEmbed(
									user,
									reaction,
									Role,
									Channel,
									Message,
								),
							],
						}).catch(() => {});
						return;
					}
				}

				if (Option === 6) {
					try {
						if (
							member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							reaction.message.reactions.cache
								.find((r) => r.emoji.name === Emoji.name)
								.users.remove(user.id)
								.catch(() => {});
							await member.roles
								.remove(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.REMOVE.6",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});

							this.ReactionCooldown.add(user.id);
							setTimeout(() => {
								this.ReactionCooldown.delete(user.id);
							}, this.TIMER);

							return;
						}
						if (
							!member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							reaction.message.reactions.cache
								.find((r) => r.emoji.name === Emoji.name)
								.users.remove(user.id)
								.catch(() => {});
							await member.roles
								.add(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.ADD.6",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});

							if (guildData.Settings.ReactionDM) {
								MessageTools.send(user, {
									embeds: [
										await this.embeds.EventAddEmbed(
											user,
											reaction,
											Role,
											Channel,
											Message,
										),
									],
								}).catch(() => {});
							}
							this.ReactionCooldown.add(user.id);
							setTimeout(() => {
								this.ReactionCooldown.delete(user.id);
							}, this.TIMER);
						}
					} catch (err) {
						this.ClientCooldown.add(reaction.message.guildId);
						setTimeout(() => {
							this.ClientCooldown.delete(reaction.message.guildId);
						}, 6000);
						MessageTools.send(user, {
							embeds: [
								await this.embeds.EventErrorEmbed(
									user,
									reaction,
									Role,
									Channel,
									Message,
								),
							],
						}).catch(() => {});
						return;
					}
				}
			}
		}
	}
}
