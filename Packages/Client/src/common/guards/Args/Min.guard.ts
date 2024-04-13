import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Utils } from "../Utils";
import { embed } from "./Embed";

@Injectable()
export class MinArgsGuard implements CanActivate {
	public constructor(@Inject(LOCALIZATION_ADAPTER) private readonly Translate: NestedLocalizationAdapter) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const { client, context, legacyCommandOptions } = Utils.context(executionContext);
		const args = context.getArg("", -1);

		if (!context.isSlash) {
			if (args.length < legacyCommandOptions.args.min) {
				Utils.SendFunction(context, await embed(client, this.Translate, "NoMinArgs", context, legacyCommandOptions));
				return false;
			}
		}
		return true;
	}
}
