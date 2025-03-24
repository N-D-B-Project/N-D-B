// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@/modules/config";
import { Services } from "@/types/Constants";
import { formatArray } from "@/utils/Tools";
import {
	LOCALIZATION_ADAPTER,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NestedLocalizationAdapter,
} from "@necord/localization";
import {
	type CanActivate,
	type ExecutionContext,
	Inject,
	Injectable,
} from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Reflector } from "@nestjs/core";
import type { ChatInputCommandInteraction } from "discord.js";
import { NecordExecutionContext } from "necord";
import { CommandPermissionsKey } from "../decorators";

@Injectable()
export class CommandPermissionsGuard implements CanActivate {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		@Inject(Services.Config)
		private readonly configService: ConfigService,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(
		executionContext: ExecutionContext,
	): Promise<boolean> {
		const permissions = this.reflector.get(
			CommandPermissionsKey,
			executionContext.getHandler(),
		);
		const context = NecordExecutionContext.create(executionContext);
		const args = context.getArgByIndex(0);
		const interaction = args[0] as ChatInputCommandInteraction;

		if (interaction.channel.isDMBased()) {
			return true;
		}

		if (permissions.bot) {
			if (!interaction.guild.members.me.permissions.has(permissions.bot)) {
				interaction.reply(
					this.translate.getTranslation(
						"Tools.Commands.Permission.Bot",
						interaction.guildLocale,
						{
							PERMS: formatArray(permissions.bot as string[]),
						},
					),
				);
				return false;
			}
		}

		if (permissions.user) {
			if (
				!(
					await interaction.guild.members.fetch(interaction.user.id)
				).permissions.has(permissions.user)
			) {
				interaction.reply(
					this.translate.getTranslation(
						"Tools.Commands.Permission.User",
						interaction.guildLocale,
						{
							PERMS: formatArray(permissions.user as string[]),
						},
					),
				);
			}
		}

		if (permissions.guildOnly && !this.checkGuild(interaction.guildId)) {
			interaction.reply(
				this.translate.getTranslation(
					"Tools.Command.Checker.GuildOnly",
					interaction.guildLocale,
				),
			);
			return false;
		}

		if (permissions.ownerOnly && !this.checkOwner(interaction.user.id)) {
			interaction.reply(
				this.translate.getTranslation(
					"Tools.Command.Checker.OwnerOnly",
					interaction.guildLocale,
				),
			);
			return false;
		}

		return true;
	}

	private checkGuild(target: string): boolean {
		return (
			this.configService.get("Discord").Servers.NDCommunity === target ||
			this.configService.get("Discord").Servers.TestGuild === target
		);
	}

	private checkOwner(target: string) {
		return this.configService.get("Discord").Client.Owners.includes(target);
	}
}
