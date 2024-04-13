import { CommandPermissions } from "@/common/decorators";
import { Config } from "@/modules/shared/config/types";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

@Injectable()
export class OwnerPermissionGuard implements CanActivate {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly config: ConfigService<Config>,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context } = Utils.context(executionContext);

		if (permissions.ownerOnly && !this.checkOwner(context.author.id)) {
			Utils.SendFunction(
				context,
				this.translate.getTranslation("Tools/Command:Checker:OwnerOnly", context.interaction.guildLocale),
			);
			return false;
		}

		return true;
	}

	private checkOwner(target: string) {
		return this.config.getOrThrow<Config["Discord"]>("Discord").Client.Owners.includes(target);
	}
}
