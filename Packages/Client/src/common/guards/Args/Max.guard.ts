import { i18nService } from "@/modules/i18n/i18n.service";
import { Extends } from "@/types/Constants";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Utils } from "../Utils";
import { embed } from "./Embed";

export class MaxArgsGuard implements CanActivate {
  public constructor(
    @Inject(Extends.Translate) private readonly Translate: i18nService
  ) {}

  public async canActivate(
    executionContext: ExecutionContext
  ): Promise<boolean> {
    const { client, context, commandOptions } = Utils.context(executionContext);
    const args = context.getArg("", -1);

    if (!context.isSlash) {
      if (args.length > commandOptions.legacy.args.max) {
        Utils.SendFunction(
          context,
          await embed(
            client,
            this.Translate,
            "TooManyArgs",
            context,
            commandOptions
          )
        );
        return false;
      }
    }
    return true;
  }
}
