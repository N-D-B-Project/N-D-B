// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import {
	LOCALIZATION_ADAPTER,
	NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import {
	Client,
	type GuildMember,
	type MessageReaction,
	type PartialMessageReaction,
	type PartialUser,
	type Role,
	type User,
} from "discord.js";
import { Context, type ContextOf, On } from "necord";
import { MessageTools } from "@/modules/commands/Message";
import type { IDatabaseService } from "@/modules/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import type {
	IReactionRolesEmbeds,
	IReactionRolesService,
} from "../interfaces";
import { REACTION_OPTIONS } from "../types";
import { ReactionRoles } from "../types/constants";

type Action = "add" | "remove" | "toggle";

interface OptionStrategy {
	action: Action;
	removeUserReaction: boolean;
	auditKey: string;
}

const STRATEGIES: Record<REACTION_OPTIONS, OptionStrategy> = {
	[REACTION_OPTIONS._1]: {
		action: "add",
		removeUserReaction: false,
		auditKey: "Events.ReactionRoleAdd-Remove.Options.ADD.1",
	},
	[REACTION_OPTIONS._2]: {
		action: "add",
		removeUserReaction: false,
		auditKey: "Events.ReactionRoleAdd-Remove.Options.ADD.2",
	},
	[REACTION_OPTIONS._3]: {
		action: "remove",
		removeUserReaction: false,
		auditKey: "Events.ReactionRoleAdd-Remove.Options.REMOVE.3",
	},
	[REACTION_OPTIONS._4]: {
		action: "remove",
		removeUserReaction: false,
		auditKey: "Events.ReactionRoleAdd-Remove.Options.REMOVE.4",
	},
	[REACTION_OPTIONS._5]: {
		action: "remove",
		removeUserReaction: true,
		auditKey: "Events.ReactionRoleAdd-Remove.Options.REMOVE.5",
	},
	[REACTION_OPTIONS._6]: {
		action: "toggle",
		removeUserReaction: true,
		auditKey: "Events.ReactionRoleAdd-Remove.Options.ADD.6",
	},
};

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
		if (user.id === this.client.user.id) return;

		if (reaction.partial) await reaction.fetch().catch(() => null);
		if (reaction.message.partial)
			await reaction.message.fetch().catch(() => null);

		const guild = reaction.message.guild;
		if (!guild) return;

		const reactionsData = await this.reactionRoles.getAll(guild);
		if (!reactionsData?.length) return;

		const member = await guild.members.fetch(user.id).catch(() => null);
		if (!member) return;

		const guildData = await this.database.GuildRepo().get(guild.id);
		const emojiString = reaction.emoji.animated
			? `<a:${reaction.emoji.name}:${reaction.emoji.id}>`
			: `<:${reaction.emoji.name}:${reaction.emoji.id}>`;

		for (const reactionData of reactionsData) {
			const emojiMatches =
				emojiString === reactionData.emoji ||
				reaction.emoji.name === reactionData.emoji;
			if (!emojiMatches || reaction.message.id !== reactionData.message) continue;

			const role = guild.roles.cache.get(reactionData.role);
			if (!role) continue;

			const strategy = STRATEGIES[reactionData.option as REACTION_OPTIONS];
			if (!strategy) continue;

			if (this.ClientCooldown.has(guild.id)) return;
			if (this.ReactionCooldown.has(user.id)) {
				await MessageTools.send(user, {
					embeds: [
						await this.embeds.EventCooldownEmbed(
							user,
							reaction,
							this.TIMER,
							reactionData.channel,
							reactionData.message,
						),
					],
				}).catch(() => {});
			}

			await this.applyStrategy({
				strategy,
				member,
				role,
				reaction,
				user,
				reactionData,
				dmOnChange: guildData.Settings.ReactionDM,
			});
		}
	}

	private async applyStrategy(params: {
		strategy: OptionStrategy;
		member: GuildMember;
		role: Role;
		reaction: MessageReaction | PartialMessageReaction;
		user: User | PartialUser;
		reactionData: { channel: string; message: string };
		dmOnChange: boolean;
	}) {
		const { strategy, member, role, reaction, user, reactionData, dmOnChange } =
			params;
		const guild = reaction.message.guild;
		const hasRole = member.roles.cache.has(role.id);
		const auditReason = this.translate.getTranslation(
			strategy.auditKey,
			guild.preferredLocale,
		);

		try {
			if (strategy.action === "add" && !hasRole) {
				await member.roles.add(role, auditReason);
				await this.afterChange(
					"add",
					user,
					reaction,
					role,
					reactionData,
					dmOnChange,
				);
			} else if (strategy.action === "remove" && hasRole) {
				await member.roles.remove(role, auditReason);
				await this.afterChange(
					"remove",
					user,
					reaction,
					role,
					reactionData,
					dmOnChange,
				);
			} else if (strategy.action === "toggle") {
				if (hasRole) {
					await member.roles.remove(
						role,
						this.translate.getTranslation(
							"Events.ReactionRoleAdd-Remove.Options.REMOVE.6",
							guild.preferredLocale,
						),
					);
				} else {
					await member.roles.add(role, auditReason);
					await this.afterChange(
						"add",
						user,
						reaction,
						role,
						reactionData,
						dmOnChange,
					);
				}
			} else {
				return;
			}

			if (strategy.removeUserReaction) {
				await reaction.users.remove(user.id).catch(() => {});
			}

			this.armUserCooldown(user.id);
		} catch {
			this.armClientCooldown(guild.id);
			await MessageTools.send(user, {
				embeds: [
					await this.embeds.EventErrorEmbed(
						user,
						reaction,
						role,
						reactionData.channel,
						reactionData.message,
					),
				],
			}).catch(() => {});
		}
	}

	private async afterChange(
		kind: "add" | "remove",
		user: User | PartialUser,
		reaction: MessageReaction | PartialMessageReaction,
		role: Role,
		reactionData: { channel: string; message: string },
		dmOnChange: boolean,
	) {
		if (!dmOnChange) return;
		const embed =
			kind === "add"
				? await this.embeds.EventAddEmbed(
						user,
						reaction,
						role,
						reactionData.channel,
						reactionData.message,
					)
				: await this.embeds.EventRemoveEmbed(
						user,
						reaction,
						role,
						reactionData.channel,
						reactionData.message,
					);
		await MessageTools.send(user, { embeds: [embed] }).catch(() => {});
	}

	private armUserCooldown(userId: string) {
		this.ReactionCooldown.add(userId);
		setTimeout(() => this.ReactionCooldown.delete(userId), this.TIMER);
	}

	private armClientCooldown(guildId: string) {
		this.ClientCooldown.add(guildId);
		setTimeout(() => this.ClientCooldown.delete(guildId), this.TIMER);
	}
}
