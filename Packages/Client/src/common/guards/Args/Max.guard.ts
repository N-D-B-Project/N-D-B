import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Utils } from "../Utils";
import { embed } from "./Embed";

@Injectable()
export class MaxArgsGuard implements CanActivate {
	public constructor(@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const { client, context, legacyCommandOptions } = Utils.context(executionContext);
		const args = context.getArg("", -1);

		if (!context.isSlash) {
			if (args.length > legacyCommandOptions.args.max) {
				Utils.SendFunction(context, await embed(client, this.translate, "TooManyArgs", context, legacyCommandOptions));
				return false;
			}
		}
		return true;
	}
}
