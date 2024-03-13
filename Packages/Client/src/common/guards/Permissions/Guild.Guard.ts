import { CommandPermissions } from "@/common/decorators";
import { Config } from "@/modules/config/types";
import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

export class GuildPermissionGuard implements CanActivate {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly config: ConfigService<Config>,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context, slashCommandOptions } = Utils.context(executionContext);

		if ((permissions.guildOnly || slashCommandOptions?.deployMode === "Guild") && !this.checkGuild(context.guild.id)) {
			Utils.SendFunction(context, await this.Translate.TFunction(context, "Tools/Command:Checker:GuildOnly"));
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
}
