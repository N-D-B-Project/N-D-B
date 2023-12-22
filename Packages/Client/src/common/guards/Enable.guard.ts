import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Utils } from "./Utils";

export class EnableGuard implements CanActivate {
	public constructor(@Inject(Extends.Translate) private readonly Translate: Ii18nService) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const { context, commandOptions } = Utils.context(executionContext);

		if (commandOptions.disable) {
			Utils.SendFunction(context, await this.Translate.TFunction(context, "Tools/Command:Checker:Disable"));
			return false;
		}

		return true;
	}
}
