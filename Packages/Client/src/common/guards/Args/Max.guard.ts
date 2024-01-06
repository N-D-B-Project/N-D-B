import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Utils } from "../Utils";
import { embed } from "./Embed";

export class MaxArgsGuard implements CanActivate {
	public constructor(@Inject(Extends.Translate) private readonly Translate: Ii18nService) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const { client, context, legacyCommandOptions } = Utils.context(executionContext);
		const args = context.getArg("", -1);

		if (!context.isSlash) {
			if (args.length > legacyCommandOptions.args.max) {
				Utils.SendFunction(context, await embed(client, this.Translate, "TooManyArgs", context, legacyCommandOptions));
				return false;
			}
		}
		return true;
	}
}
