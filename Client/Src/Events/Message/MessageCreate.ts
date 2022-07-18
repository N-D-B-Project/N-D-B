import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { EventOptions } from "~/Types";
import { CommandTools } from "@Utils/Tools";
import { Message } from "discord.js";
import { ReactionRole } from "~/Packages";

export default class MessageCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageCreate",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, message: Message) {
    const react: ReactionRole = new ReactionRole(client, "MessageEvent");
    if (message.author.bot) return;

    const cmdTools = new CommandTools(client);
    if (cmdTools.checkGuild(message.guildId)) {
      client.emit("GuildOnly", message);
    }

    //TODO UserProfile
    const UserProfile = await client.Mongoose.FindUserProfile(message.author);
    if (!UserProfile) {
      await client.Mongoose.CreateUserProfile(message, message.author);
    }
    await client.Mongoose.AddGuildToProfile(message, message.author);

    //@ ReactionRole
    const ReactionConfig = await react.FindGuild(message.guildId);
    if (!ReactionConfig) {
      await react.PreCreate(message.guild);
    }

    //! GuildConfigs
    const guildConfig = await client.Mongoose.FindGuildConfig(message.guild);
    if (!guildConfig) {
      await client.Mongoose.CreateGuildConfig(message.guild);
    } else {
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
          await client.translate("Events/MessageCreate:MyPrefix", message, {
            GUILD_NAME: message.guild.name,
            PREFIX: Prefix,
          })
        );
        return;
      }
    }

    //$ Commands
    if (message.content.startsWith(Prefix)) {
      client.emit("Command", message, Prefix, UserProfile, guildConfig);
    }
  }
}
