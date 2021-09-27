import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import { BaseCommand } from "@Structures/BaseCommand";
import * as Discord from "discord.js";
import { TFunction } from "i18next";

export default class ClientCollections {
  private client: NDBClient;

  public commands: Discord.Collection<unknown, BaseCommand> =
    new Discord.Collection();
  public aliases: Discord.Collection<unknown, unknown> =
    new Discord.Collection();
  public events: Discord.Collection<string, BaseEvent> =
    new Discord.Collection();
  public tranlations: Map<string, TFunction> = new Map();
  public snipe: Map<any, any> = new Map();
  public editSnipe: Map<any, any> = new Map();
  public react: Map<any, any> = new Map();
  public fetchguild: Map<any, any> = new Map();

  constructor(client: NDBClient) {
    this.client = client;
    this.snipe = new Map();
    this.editSnipe = new Map();
    this.react = new Map();
  }
}
