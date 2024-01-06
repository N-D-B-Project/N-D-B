import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CommandConfig } from "../decorators";
import { Utils } from "./Utils";

export class EnableGuard implements CanActivate {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const { context } = Utils.context(executionContext);

		const commandConfig = this.reflector.get(CommandConfig.KEY, executionContext.getHandler());

		if (commandConfig.disable) {
			Utils.SendFunction(context, await this.Translate.TFunction(context, "Tools/Command:Checker:Disable"));
			return false;
		}

		return true;
	}
}
