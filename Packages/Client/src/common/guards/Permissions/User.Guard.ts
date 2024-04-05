import { CommandPermissions } from "@/common/decorators";
import type { Ii18nService } from "@/modules/bot/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

@Injectable()
export class UserPermissionGuard implements CanActivate {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context } = Utils.context(executionContext);

		if (permissions.user) {
			if (!(await context.guild.members.fetch(context.author.id)).permissions.has(permissions.user)) {
				Utils.SendFunction(
					context,
					await this.Translate.TFunction(context, "Tools/Commands:Permission:User", {
						PERMS: Utils.formatArray(permissions.user as Array<string>),
					}),
				);
			}
		}

		return true;
	}
}
