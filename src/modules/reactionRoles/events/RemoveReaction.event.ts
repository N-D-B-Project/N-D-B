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
export class ReactionRolesEvents {
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

	@On("messageReactionRemove")
	public async onReactionRolesRemove(
		@Context() [reaction, user]: ContextOf<"messageReactionAdd">,
	) {
		if (user === this.client.user) return;

		const reactionsData = await this.reactionRoles.getAll(
			reaction.message.guild,
		);
		const guildData = await this.database
			.GuildRepo()
			.get(reaction.message.guildId);
		const Member = reaction.message.guild.members.cache.get(user.id);
		const Guild = reaction.message.guild;
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
				const Role = Guild.roles.cache.get(reactionData.role);
				const {
					message: Message,
					channel: Channel,
					option: Option,
				} = reactionData;
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
							Member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							await Member.roles
								.remove(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.REMOVE:1",
										reaction.message.guild.preferredLocale,
									),
								)
								.catch(() => {});
							this.ReactionCooldown.add(user.id);
							setTimeout(() => {
								this.ReactionCooldown.delete(user.id);
							}, 2000);

							if (guildData.Settings.ReactionDM) {
								if (this.ClientCooldown.has(reaction.message.guildId)) return;
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
								this.ClientCooldown.add(reaction.message.guildId);
								setTimeout(() => {
									this.ClientCooldown.delete(reaction.message.guildId);
								}, 4000);
							}
						}
					} catch (err) {
						if (this.ClientCooldown.has(reaction.message.guildId)) return;
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
					}
				}

				if (Option === 4) {
					try {
						if (
							!Member.roles.cache.find(
								(r) => r.name.toLowerCase() === Role.name.toLowerCase(),
							)
						) {
							await Member.roles
								.add(
									Role,
									this.translate.getTranslation(
										"Events.ReactionRoleAdd-Remove.Options.ADD.4",
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
							}, 2000);
						}
					} catch (err) {
						if (this.ClientCooldown.has(reaction.message.guildId)) return;
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
					}
				}
			}
		}
	}
}
