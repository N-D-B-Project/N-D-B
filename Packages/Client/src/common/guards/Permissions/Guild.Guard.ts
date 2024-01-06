import { CommandPermissions } from "@/common/decorators";
import { Extends, Services } from "@/types/Constants";
import { IDatabaseService, Ii18nService } from "@/types/Interfaces";
import { Tools } from "@/utils/Tools";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

export class GuildPermissionGuard implements CanActivate {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		@Inject(Services.Database) private readonly database: IDatabaseService,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context, slashCommandOptions } = Utils.context(executionContext);

		if (
			(permissions.guildOnly || slashCommandOptions?.deployMode === "Guild") &&
			!Tools.checkGuild(this.database.ConfigRepo(), context.guild.id)
		) {
			Utils.SendFunction(context, await this.Translate.TFunction(context, "Tools/Command:Checker:GuildOnly"));
			return false;
		}

		return true;
	}
}
