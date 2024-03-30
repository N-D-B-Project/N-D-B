import { CommandPermissions } from "@/common/decorators";
import type { Ii18nService } from "@/modules/bot/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

export class BotPermissionGuard implements CanActivate {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context } = Utils.context(executionContext);

		if (permissions.bot) {
			if (!context.guild.members.me.permissions.has(permissions.bot)) {
				Utils.SendFunction(
					context,
					await this.Translate.TFunction(context, "Tools/Commands:Permission:Bot", {
						PERMS: Utils.formatArray(permissions.bot as Array<string>),
					}),
				);
				return false;
			}
		}

		return true;
	}
}
