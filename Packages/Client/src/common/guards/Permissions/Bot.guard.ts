import { i18nService } from "@/modules/i18n/i18n.service";
import { Extends } from "@/types/Constants";
import { Tools } from "@/utils/Tools";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Utils } from "../Utils";

export class BotPermissionGuard implements CanActivate {
  public constructor(
    @Inject(Extends.Translate) private readonly Translate: i18nService
  ) {}

  public async canActivate(
    executionContext: ExecutionContext
  ): Promise<boolean> {
    const { context, commandOptions } = Utils.context(executionContext);

    if (commandOptions.permissions.bot) {
      if (
        !context.guild.members.me.permissions.has(
          commandOptions.permissions.bot
        )
      ) {
        Utils.SendFunction(
          context,
          await this.Translate.TFunction(
            context,
            "Tools/Commands:Permission:Bot",
            {
              PERMS: Tools.formatArray(
                commandOptions.permissions.bot as Array<string>
              )
            }
          )
        );
        return false;
      }
    }

    return true;
  }
}
