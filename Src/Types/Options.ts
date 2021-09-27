import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";

export interface EventOptions {
  name: string;
  once?: boolean;
  manyArgs?: number;
}

export interface CommandOptions {
  client: NDBClient;
  name: string;
  aliases: Array<string>;
  description: string;
  category: string;
  usage: string;
  disable?: boolean;
  cooldown?: number;
  userPerms?: Array<string>;
  botPerms?: Array<string>;
  guildOnly?: boolean;
  ownerOnly?: boolean;
  nsfw?: boolean;
  ndcash?: number;
  SlashOptions?: Discord.ApplicationCommandData;
}

export interface LoggerOptions {
  type: string;
}
