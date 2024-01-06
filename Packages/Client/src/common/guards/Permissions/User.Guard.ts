import { CommandPermissions } from "@/common/decorators";
import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { Tools } from "@/utils/Tools";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

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
						PERMS: Tools.formatArray(permissions.user as Array<string>),
					}),
				);
			}
		}

		return true;
	}
}
