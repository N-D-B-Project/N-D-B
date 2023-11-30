import { i18nService } from "@/modules/i18n/i18n.service";
import { Extends } from "@/types/Constants";
import { Tools } from "@/utils/Tools";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Utils } from "../Utils";

export class GuildPermissionGuard implements CanActivate {
  public constructor(
    @Inject(Extends.Translate) private readonly Translate: i18nService,
    private readonly config: ConfigService
  ) {}

  public async canActivate(
    executionContext: ExecutionContext
  ): Promise<boolean> {
    const { context, commandOptions } = Utils.context(executionContext);

    if (
      (commandOptions.permissions.guildOnly ||
        commandOptions.slash?.deployMode === "Guild") &&
      !Tools.checkGuild(this.config, context.guild.id)
    ) {
      Utils.SendFunction(
        context,
        await this.Translate.TFunction(
          context,
          "Tools/Command:Checker:GuildOnly"
        )
      );
      return false;
    }

    return true;
  }
}
