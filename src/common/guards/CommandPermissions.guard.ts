import { CommandPermissions } from "@/common/decorators";
import type { Config } from "@/modules/shared/config/types";
import { formatArray } from "@/utils/Tools";
import { LOCALIZATION_ADAPTER, type NestedLocalizationAdapter } from "@necord/localization";
import { type CanActivate, type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { Reflector } from "@nestjs/core";
import type { ChatInputCommandInteraction } from "discord.js";
import { NecordExecutionContext } from "necord";

@Injectable()
export class CommandPermissionsGuard implements CanActivate {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly reflector: Reflector,
		private readonly config: ConfigService,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const context = NecordExecutionContext.create(executionContext);
		const args = context.getArgByIndex(0);
		const interaction = args[0] as ChatInputCommandInteraction;

		if (permissions.bot) {
			if (!interaction.guild.members.me.permissions.has(permissions.bot)) {
				interaction.reply(
					this.translate.getTranslation("Tools.Commands.Permission.Bot", interaction.guildLocale, {
						PERMS: formatArray(permissions.bot as string[]),
					}),
				);
				return false;
			}
		}

		if (permissions.user) {
			if (!(await interaction.guild.members.fetch(interaction.user.id)).permissions.has(permissions.user)) {
				interaction.reply(
					this.translate.getTranslation("Tools.Commands.Permission.User", interaction.guildLocale, {
						PERMS: formatArray(permissions.user as string[]),
					}),
				);
			}
		}

		if (permissions.guildOnly && !this.checkGuild(interaction.guildId)) {
			interaction.reply(this.translate.getTranslation("Tools.Command.Checker.GuildOnly", interaction.guildLocale));
			return false;
		}

		if (permissions.ownerOnly && !this.checkOwner(interaction.user.id)) {
			interaction.reply(this.translate.getTranslation("Tools.Command.Checker.OwnerOnly", interaction.guildLocale));
			return false;
		}

		return true;
	}

	private checkGuild(target: string): boolean {
		return (
			this.config.getOrThrow<Config["Discord"]>("Discord").Servers.NDCommunity === target ||
			this.config.getOrThrow<Config["Discord"]>("Discord").Servers.TestGuild === target
		);
	}

	private checkOwner(target: string) {
		return this.config.getOrThrow<Config["Discord"]>("Discord").Client.Owners.includes(target);
	}
}
