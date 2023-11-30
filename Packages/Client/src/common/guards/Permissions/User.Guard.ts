import { i18nService } from "@/modules/i18n/i18n.service";
import { Extends } from "@/types/Constants";
import { Tools } from "@/utils/Tools";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Utils } from "../Utils";

export class UserPermissionGuard implements CanActivate {
  public constructor(
    @Inject(Extends.Translate) private readonly Translate: i18nService
  ) {}

  public async canActivate(
    executionContext: ExecutionContext
  ): Promise<boolean> {
    const { context, commandOptions } = Utils.context(executionContext);

    if (commandOptions.permissions.user) {
      if (
        !(await context.guild.members.fetch(context.author.id)).permissions.has(
          commandOptions.permissions.user
        )
      ) {
        Utils.SendFunction(
          context,
          await this.Translate.TFunction(
            context,
            "Tools/Commands:Permission:User",
            {
              PERMS: Tools.formatArray(
                commandOptions.permissions.user as Array<string>
              )
            }
          )
        );
      }
    }

    return true;
  }
}
