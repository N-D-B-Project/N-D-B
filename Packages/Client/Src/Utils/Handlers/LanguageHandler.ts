import { INDBClient } from "@/Types";
import {
  CommandInteraction,
  GuildChannel,
  Message,
  PartialMessage,
  User
} from "discord.js";
import { promises as fs } from "fs";
import i18next, { TFunction } from "i18next";
import Backend from "i18next-fs-backend";
import * as path from "path";
import { Context } from "../Structures";
import { Logger } from "../Tools";

async function walkDirectory(
  dir: string,
  namespaces: string[] = [],
  folderName = ""
) {
  const files = await fs.readdir(dir);

  const languages: string[] = [];
  for (const file of files) {
    const stat = await fs.stat(path.join(dir, file));
    if (stat.isDirectory()) {
      const isLanguage = file.includes("-");
      if (isLanguage) languages.push(file);

      const folder = await walkDirectory(
        path.join(dir, file),
        namespaces,
        isLanguage ? "" : `${file}/`
      );

      namespaces = folder.namespaces;
    } else {
      namespaces.push(`${folderName}${file.substr(0, file.length - 5)}`);
    }
  }

  return { namespaces: [...new Set(namespaces)], languages };
}

export default async (logger: Logger): Promise<Map<string, TFunction>> => {
  const { namespaces, languages } = await walkDirectory(
    path.resolve(__dirname, "../Languages/i18next/")
  );

  let TF: boolean;
  if (process.env.Debug === "True") {
    TF = true;
  } else if (process.env.Debug === "False") {
    TF = false;
  }

  await i18next.use(Backend).init(
    {
      initImmediate: false,
      interpolation: { escapeValue: false },
      load: "all",
      compatibilityJSON: "v4",
      debug: TF,
      fallbackLng: "pt-BR",
      backend: {
        jsonIndent: 2,
        loadPath: path.resolve(
          __dirname,
          "../Languages/i18next/{{lng}}/{{ns}}.json"
        )
      },
      ns: namespaces,
      preload: languages
    },
    async () => {
      logger.info(
        `${
          languages.length
        } linguagens foram carregadas com sucesso! (${languages.join(" | ")})`
      );
    }
  );

  return new Map(languages.map(item => [item, i18next.getFixedT(item)]));
};

export class Translate {
  // eslint-disable-next-line no-empty-function
  public constructor(private readonly client: INDBClient) {}

  async Guild(
    key: string,
    info:
      | Message
      | CommandInteraction
      | GuildChannel
      | PartialMessage
      | Context,
    args?: Record<string, unknown>
  ) {
    const find = await this.client.database.GuildRepo.get(info.guild.id);
    let locale = find.Settings.Language;
    if (!locale) locale = "pt-BR";
    const language = this.client.Collections.translations.get(locale);
    if (!language) throw "Linguagem invalida || Key não encontrada";
    return language(key, args);
  }

  async DM(key: string, user: User, args?: Record<string, unknown>) {
    const find = await this.client.database.UserRepo.get(user.id);
    let locale = find.Settings.Language;
    if (!locale) locale = "pt-BR";
    const language = this.client.Collections.translations.get(locale);
    if (!language) throw "Linguagem invalida || Key não encontrada";
    return language(key, args);
  }

  public async TFunction(
    context: Context,
    key: string,
    args?: Record<string, unknown>
  ) {
    if (context.isDM || (context.isSub && context.isDM)) {
      return await this.DM(key, context.author, args);
    }
    if (context.isSlash) {
      return await this.Guild(key, context.interaction, args);
    }
    return await this.Guild(key, context.message, args);
  }
}
