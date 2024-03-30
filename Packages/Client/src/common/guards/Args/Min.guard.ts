import type { Ii18nService } from "@/modules/bot/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Utils } from "../Utils";
import { embed } from "./Embed";

export class MinArgsGuard implements CanActivate {
	public constructor(@Inject(Extends.Translate) private readonly Translate: Ii18nService) {}

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
