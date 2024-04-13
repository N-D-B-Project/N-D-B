import { CommandPermissions } from "@/common/decorators";
import { Extends } from "@/types/Constants";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

@Injectable()
export class UserPermissionGuard implements CanActivate {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context } = Utils.context(executionContext);

		if (permissions.user) {
			if (!(await context.guild.members.fetch(context.author.id)).permissions.has(permissions.user)) {
				Utils.SendFunction(
					context,
					this.translate.getTranslation("Tools/Commands:Permission:User", context.interaction.guildLocale, {
						PERMS: Utils.formatArray(permissions.user as Array<string>),
					}),
				);
			}
		}

		return true;
	}
}
