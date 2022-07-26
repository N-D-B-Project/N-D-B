import { promises as fs } from "fs";
import * as path from "path";
import i18next, { TFunction } from "i18next";
import Backend from "i18next-fs-backend";
import NDBClient from "~/Client/NDBClient";
import {
  Message,
  CommandInteraction,
  GuildChannel,
  PartialMessage,
  User,
} from "discord.js";

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

export default async (): Promise<Map<string, TFunction>> => {
  const options = {
    jsonIndent: 2,
    loadPath: path.resolve(__dirname, "../Languages/{{lng}}/{{ns}}.json"),
  };

  const { namespaces, languages } = await walkDirectory(
    path.resolve(__dirname, "../Languages/")
  );

  if (process.env.Debug === "True") {
    var TF = true;
  } else if (process.env.Debug === "False") {
    var TF = false;
  }

  i18next.use(Backend);
  await i18next.init({
    compatibilityJSON: "v3",
    backend: options,
    debug: TF,
    fallbackLng: "pt-BR",
    initImmediate: false,
    interpolation: { escapeValue: false },
    load: "all",
    ns: namespaces,
    preload: languages,
  });

  return new Map(languages.map((item) => [item, i18next.getFixedT(item)]));
};

export class Translate {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async Guild(
    key: string,
    info: Message | CommandInteraction | GuildChannel | PartialMessage,
    args?: Record<string, unknown>
  ) {
    const find = await this.client.Mongoose.FindGuildConfig(info.guild);
    var locale = find.get("Settings.Language");
    if (!locale) locale = "pt-BR";
    const language = this.client.Collections.translations.get(locale);
    if (!language) throw "Linguagem invalida || Key não encontrada";
    return language(key, args);
  }

  async DM(key: string, user: User, args?: Record<string, unknown>) {
    const find = await this.client.Mongoose.FindUserProfile(user);
    var locale = find.get("Settings.Language");
    if (!locale) locale = "pt-BR";
    const language = this.client.Collections.translations.get(locale);
    if (!language) throw "Linguagem invalida || Key não encontrada";
    return language(key, args);
  }
}
