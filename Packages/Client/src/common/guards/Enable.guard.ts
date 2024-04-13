import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CommandConfig } from "../decorators";
import { Utils } from "./Utils";

@Injectable()
export class EnableGuard implements CanActivate {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const { context } = Utils.context(executionContext);

		const commandConfig = this.reflector.get(CommandConfig.KEY, executionContext.getHandler());

		if (commandConfig.disable) {
			Utils.SendFunction(
				context,
				this.translate.getTranslation("Tools/Command:Checker:Disable", context.interaction.guildLocale),
			);
			return false;
		}

		return true;
	}
}
