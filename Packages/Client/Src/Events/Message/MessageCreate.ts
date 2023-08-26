import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { ChannelType, EmbedBuilder, Message } from "discord.js";

export default class MessageCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageCreate",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, message: Message) {
    if (message.author.bot) return;
    const emojis = message.content.match(/(?<=:)([^:\s]+)(?=:)/g);
    if (emojis) {
      client.emit("NotQuiteNitro", message, emojis);
    }

    const guildRepository = client.database.GuildRepo;

    // GuildConfig
    let guildConfig = await guildRepository.get(message.guildId);
    if (!guildConfig && message.channel.type !== ChannelType.DM) {
      const createdGuildConfig = await guildRepository.create(message.guild);
      if (createdGuildConfig) {
        guildConfig = await guildRepository.get(message.guildId);
      }
      client.logger.database(
        `${message.guild.name} Configuration Created on Database\n`
      );
      MessageTools.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.guild.name,
              iconURL: message.guild.iconURL()
            })
            .setTitle(
              await client.Translate.Guild(
                "Events/MessageCreate:ConfigurationCreated:Title",
                message
              )
            )
            .setDescription(
              (await client.Translate.Guild(
                "Events/MessageCreate:ConfigurationCreated:Description",
                message
              )) + `\`\`\`JSON\n${JSON.stringify(guildConfig, null, 3)}\`\`\``
            )

            .setColor("#00c26f")
            .setTimestamp()
        ]
      });
    } else if (guildConfig && message.channel.type !== ChannelType.DM) {
      const { Prefix: dbPrefix, Premium } = guildConfig.Settings;
      const mentionRegex = RegExp(`<@!${client.user.id}>$`);
      const mentionRegexPrefix = RegExp(`^<@!${client.user.id}> `);

      const Prefix = message.content.match(mentionRegexPrefix)
        ? message.content.match(mentionRegexPrefix)[0]
        : dbPrefix;

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
              PREFIX: Prefix
            }
          )
        );
        return;
      }
      // Commands
      if (message.content.startsWith(Prefix)) {
        client.emit("Command", message, Prefix, Premium);
      }
    } else if (message.channel.type === ChannelType.DM) {
      client.emit("DMCommand", message, "&");
    }
  }
}
