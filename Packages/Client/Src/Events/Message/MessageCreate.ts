import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { EventOptions } from "~/Types";
import { CommandTools } from "@Utils/Tools";
import { Message, ChannelType } from "discord.js";
import { GuildConfig, UserProfile } from "~/Database/Schemas";

export default class MessageCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageCreate",
      type: "on",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(client: NDBClient, message: Message) {
    if (message.author.bot) return;

    const cmdTools = new CommandTools(client);
    if (cmdTools.checkGuild(message.guildId)) {
      client.emit("GuildOnly", message);
    }

    //@ UserProfile
    const UserProfile = await client.Database.FindUserProfile(message.author);
    if (!UserProfile) {
      await client.Database.CreateUserProfile(message, message.author);
    }
    await client.Database.AddGuildToProfile(message, message.author);

    //! GuildConfigs
    const guildConfig = await GuildConfig.getGuildConfig(message.guild);
    if (!guildConfig && message.channel.type !== ChannelType.DM) {
      await GuildConfig.CreateConfig(client, message.guild);
    } else if (guildConfig && message.channel.type !== ChannelType.DM) {
      //@ Prefix
      const mentionRegex = RegExp(`<@!${client.user.id}>$`);
      const mentionRegexPrefix = RegExp(`^<@!${client.user.id}> `);
      const GetPrefix = guildConfig.get("Settings.Prefix");

      var Prefix = message.content.match(mentionRegexPrefix)
        ? message.content.match(mentionRegexPrefix)[0]
        : GetPrefix;

      if (message.content == Prefix) return;

      if (!message.content.startsWith(Prefix)) return;

      //TODO Doesn't working...
      if (message.content.match(mentionRegex)) {
        message.channel.send(
          await client.Translate.Guild(
            "Events/MessageCreate:MyPrefix",
            message,
            {
              GUILD_NAME: message.guild.name,
              PREFIX: Prefix,
            }
          )
        );
        return;
      }

      //$ Commands
      if (message.content.startsWith(Prefix)) {
        client.emit("Command", message, Prefix, UserProfile);
      }
    } else if (
      message.content.startsWith("&") &&
      message.channel.type === ChannelType.DM
    ) {
      client.emit("DMCommand", message, "&");
    }
  }
}
