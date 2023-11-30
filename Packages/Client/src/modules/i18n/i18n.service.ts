import { Config } from "@/types";
import { Repositories } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  CommandInteraction,
  GuildChannel,
  Message,
  PartialMessage
} from "discord.js";
import { I18nService } from "nestjs-i18n";
import { Context } from "../commands/Commands.context";
import { GuildRepository } from "../database/repositories/Guild.repository";

type Info =
  | Message
  | CommandInteraction
  | GuildChannel
  | PartialMessage
  | Context;

@Injectable()
export class i18nService {
  private logger = new Logger(i18nService.name);
  public constructor(
    @Inject(Repositories.Guild) private readonly GuildRepo: GuildRepository,
    private readonly i18n: I18nService,
    private readonly config: ConfigService
  ) {}

  public Logger() {
    const languages = this.i18n.getSupportedLanguages();
    const namespaces = this.i18n.getTranslations();
    this.logger.log(
      `${
        languages.length
      } linguagens foram carregadas com sucesso! (${languages.join(" | ")})`
    );
    if (this.config.getOrThrow<Config["Debug"]>("Debug").Translations)
      this.logger.debug(namespaces);
  }

  public async Guild(info: Info, key: string, args?: unknown): Promise<string> {
    const lang = (await this.GuildRepo.get(info.guild.id)).Settings.Language;
    return this.i18n.translate(this.fixKey(key), { args, lang });
  }

  // async DM(key: string, user: User, args?: Record<string, unknown>) {
  //   const lang = (await this.UserRepo.get(user.id)).Settings.Language;
  //   return this.i18n.translate(this.fixKey(key), {args, lang});
  // }

  public async TFunction(
    context: Context,
    key: string,
    args?: Record<string, unknown>
  ) {
    // if (context.isDM || (context.isSub && context.isDM)) {
    //   return await this.DM(key, context.author, args);
    // }

    if (context.isSlash) {
      return await this.Guild(context.interaction, key, args);
    }
    return await this.Guild(context.message, key, args);
  }

  private fixKey(target: string): string {
    return target.replace(/[\/:]/g, ".");
  }
}
