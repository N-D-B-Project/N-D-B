import { CommandPermissions } from "@/common/decorators";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

@Injectable()
export class BotPermissionGuard implements CanActivate {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context } = Utils.context(executionContext);

		if (permissions.bot) {
			if (!context.guild.members.me.permissions.has(permissions.bot)) {
				Utils.SendFunction(
					context,
					this.translate.getTranslation("Tools/Commands:Permission:Bot", context.interaction.guildLocale, {
						PERMS: Utils.formatArray(permissions.bot as Array<string>),
					}),
				);
				return false;
			}
		}

		return true;
	}
}
