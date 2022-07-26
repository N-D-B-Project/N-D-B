import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import { MessageTools, InteractionTools } from "@Utils/Tools";
import { BaseCommand } from "@Utils/Structures";
import { Emojis } from "~/Config/Config";
import { ReactionRole } from "~/Packages";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Message,
  TextChannel,
} from "discord.js";

export default class ReactionBuilderCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "ReactionBuilder",
      aliases: [
        "BReacion",
        "RBuilder",
        "reactionbuilder",
        "buildreaction",
        "buildr",
      ],
      description: "Inicia a criação de uma Reaction Role",
      category: "🎩 ReactionRole",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false,
      // SlashOptions: {
      //   name: "",
      //   ephemeral: true,
      //   description: "",
      // },
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    const cancelEmbed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({
          extension: "gif",
          size: 128,
        }),
      })
      .setDescription(
        await client.Translate.Guild(
          "🎩 ReactionRole/ReactionBuilder:Cancel:1:Description",
          message,
          { FAIL: Emojis.fail }
        )
      )
      .setColor("#c20e00")
      .setFooter({
        text: await client.Translate.Guild(
          "🎩 ReactionRole/ReactionBuilder:Global:Footer",
          message,
          { NAME: client.user.username, CMD: this.options.name }
        ),
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    const cancelEmbed2 = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({
          extension: "gif",
          size: 128,
        }),
      })
      .setDescription(
        await client.Translate.Guild(
          "🎩 ReactionRole/ReactionBuilder:Cancel:2:Description",
          message,
          { FAIL: Emojis.fail }
        )
      )
      .setColor("#c20e00")
      .setFooter({
        text: await client.Translate.Guild(
          "🎩 ReactionRole/ReactionBuilder:Global:Footer",
          message,
          { NAME: client.user.username, CMD: this.options.name }
        ),
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    const timeoutEmbed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({
          extension: "gif",
          size: 128,
        }),
      })
      .setDescription(
        await client.Translate.Guild(
          "🎩 ReactionRole/ReactionBuilder:Cancel:Time:Description",
          message,
          { FAIL: Emojis.fail }
        )
      )
      .setColor("#c20e00")
      .setFooter({
        text: await client.Translate.Guild(
          "🎩 ReactionRole/ReactionBuilder:Global:Footer",
          message,
          { NAME: client.user.username, CMD: this.options.name }
        ),
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const react = new ReactionRole(client, "ReactionBuilder");
    const filter = (m) => m.author.id === message.author.id;
    var MSG = await MessageTools.reply(message, {
      content: await client.Translate.Guild(
        "🎩 ReactionRole/ReactionBuilder:Channel",
        message
      ),
    });
    await message.channel
      .awaitMessages({
        filter,
        max: 1,
        time: 60000,
        errors: ["time"],
      })
      .then(async (collected_channel) => {
        var channel = collected_channel.first().content;
        var channelMention = collected_channel.first().mentions;
        var channelToSend =
          channelMention.channels.first() ||
          message.guild.channels.cache.get(channel.toLowerCase()) ||
          message.guild.channels.cache.find(
            (ch) => ch.name === channel.toLowerCase()
          );
        if (channel === "X_X") {
          await MessageTools.edit(MSG, {
            content: "",
            embeds: [cancelEmbed],
          });
          client.Tools.WAIT(2500);
          collected_channel.first().delete();
          return;
        }
        if (!channelToSend) {
          await MessageTools.edit(MSG, {
            content: "",
            embeds: [cancelEmbed2],
          });
          return;
        }
        client.Tools.WAIT(2500);
        collected_channel.first().delete();

        await MessageTools.edit(MSG, {
          content: await client.Translate.Guild(
            "🎩 ReactionRole/ReactionBuilder:ID",
            message
          ),
        });
        await message.channel
          .awaitMessages({
            filter,
            max: 1,
            time: 60000,
            errors: ["time"],
          })
          .then(async (collected_message) => {
            channelToSend = channelToSend as TextChannel;
            var ID = collected_message.first().content;
            if (ID === "X_X") {
              await MessageTools.edit(MSG, {
                content: "",
                embeds: [cancelEmbed],
              });
              client.Tools.WAIT(2500);
              collected_message.first().delete();
              return;
            }
            var messageID = await channelToSend.messages
              .fetch(ID)
              .catch((err) => {
                client.logger.error(err);
              });
            if (!messageID) {
              await MessageTools.edit(MSG, {
                content: "",
                embeds: [cancelEmbed2],
              });
              client.Tools.WAIT(2500);
              collected_message.first().delete();
              return;
            }
            client.Tools.WAIT(2500);
            collected_message.first().delete();

            await MessageTools.edit(MSG, {
              content: await client.Translate.Guild(
                "🎩 ReactionRole/ReactionBuilder:Role:Specify",
                message
              ),
            });
            await message.channel
              .awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ["time"],
              })
              .then(async (collected_role) => {
                var roleName = collected_role.first().content;
                var roleMention = collected_role.first().mentions;
                var role =
                  roleMention.roles.first() ||
                  message.guild.roles.cache.find(
                    (rl) => rl.name === roleName
                  ) ||
                  message.guild.roles.cache.get(roleName);
                if (roleName === "X_X") {
                  await MessageTools.edit(MSG, {
                    content: "",
                    embeds: [cancelEmbed],
                  });
                  client.Tools.WAIT(2500);
                  collected_role.first().delete();
                  return;
                }
                if (!role) {
                  await MessageTools.edit(MSG, {
                    content: "",
                    embeds: [cancelEmbed2],
                  });
                  client.Tools.WAIT(2500);
                  collected_role.first().delete();
                  return;
                }
                if (role.managed) {
                  await MessageTools.edit(MSG, {
                    content: await client.Translate.Guild(
                      "🎩 ReactionRole/ReactionBuilder:Role:Managed",
                      message
                    ),
                    embeds: [],
                  });
                  client.Tools.WAIT(2500);
                  collected_role.first().delete();
                  return;
                }
                client.Tools.WAIT(2500);
                collected_role.first().delete();

                await MessageTools.edit(MSG, {
                  content: await client.Translate.Guild(
                    "🎩 ReactionRole/ReactionBuilder:Emoji:Specify",
                    message
                  ),
                  embeds: [],
                });
                message.channel
                  .awaitMessages({
                    filter,
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                  })
                  .then(async (collected_emoji) => {
                    var collectedEmoji = collected_emoji.first().content;
                    const Emoji = client.emojis.cache.get(collectedEmoji);

                    if (!collectedEmoji) {
                      await MessageTools.edit(MSG, {
                        content: await client.Translate.Guild(
                          "🎩 ReactionRole/ReactionBuilder:Emoji:Invalid",
                          message,
                          { FAIL: Emojis.fail }
                        ),
                        embeds: [],
                      });
                    }

                    if (collectedEmoji === "X_X") {
                      await MessageTools.edit(MSG, {
                        content: "",
                        embeds: [cancelEmbed],
                      });
                      client.Tools.WAIT(2500);
                      collected_emoji.first().delete();
                    }

                    client.Tools.WAIT(2500);
                    collected_emoji.first().delete();

                    try {
                      (messageID = messageID as Message),
                        messageID.react(Emoji);
                    } catch (error) {
                      client.logger.error(
                        "ReactionBuilder | trying ReactMessage",
                        `Error: ${error}`
                      );
                    }

                    await MessageTools.edit(MSG, {
                      content: await client.Translate.Guild(
                        "🎩 ReactionRole/ReactionBuilder:Chose:Options",
                        message
                      ),
                    });

                    message.channel
                      .awaitMessages({
                        filter,
                        max: 1,
                        time: 60000,
                        errors: ["time"],
                      })
                      .then(async (collected_option) => {
                        var option = collected_option.first().content;
                        var OptionArr = ["1", "2", "3", "4", "5", "6"];

                        if (option === "X_X") {
                          await MessageTools.edit(MSG, {
                            content: "",
                            embeds: [cancelEmbed],
                          });
                          client.Tools.WAIT(2500);
                          collected_option.first().delete();
                        }
                        if (!OptionArr.includes(option)) {
                          await MessageTools.edit(MSG, {
                            content: await client.Translate.Guild(
                              "🎩 ReactionRole/ReactionBuilder:Chose:Invalid",
                              message
                            ),
                          });
                          return;
                        }

                        client.Tools.WAIT(2500);
                        collected_option.first().delete();
                        messageID = messageID as Message;
                        await MessageTools.edit(MSG, {
                          content: "",
                          embeds: [
                            new EmbedBuilder()
                              .setTitle(
                                await client.Translate.Guild(
                                  "🎩 ReactionRole/ReactionBuilder:Config:Finish",
                                  message
                                )
                              )
                              .setAuthor({
                                name: message.guild.name,
                                iconURL: message.guild.iconURL({
                                  extension: "gif",
                                }),
                              })
                              .addFields([
                                {
                                  name: await client.Translate.Guild(
                                    "🎩 ReactionRole/ReactionBuilder:Config:Channel",
                                    message
                                  ),
                                  value: `<#${channelToSend.id}>`,
                                  inline: true,
                                },
                                {
                                  name: await client.Translate.Guild(
                                    "🎩 ReactionRole/ReactionBuilder:Config:Emoji",
                                    message
                                  ),
                                  value: `${Emoji}`,
                                  inline: true,
                                },
                                {
                                  name: await client.Translate.Guild(
                                    "🎩 ReactionRole/ReactionBuilder:Config:Role",
                                    message
                                  ),
                                  value: `${role}`,
                                  inline: true,
                                },
                                {
                                  name: await client.Translate.Guild(
                                    "🎩 ReactionRole/ReactionBuilder:Config:Message",
                                    message
                                  ),
                                  value: await client.Translate.Guild(
                                    "🎩 ReactionRole/ReactionBuilder:Config:ClickHere",
                                    message,
                                    { MsgIdURL: messageID.url }
                                  ),
                                  inline: true,
                                },
                                {
                                  name: await client.Translate.Guild(
                                    "🎩 ReactionRole/ReactionBuilder:Config:Type",
                                    message
                                  ),
                                  value: `${option}`,
                                  inline: true,
                                },
                              ])
                              .setColor("#00c26f")
                              .setTimestamp(),
                          ],
                        }).then(async () => {
                          messageID = messageID as Message;
                          messageID.react(Emoji);

                          await react.reactionCreate(
                            "Message",
                            message,
                            channel,
                            message.guildId,
                            messageID.id,
                            role.id,
                            String(Emoji),
                            Number(option)
                          );
                        });
                      })
                      .catch((err: Error) => {
                        MessageTools.edit(MSG, {
                          content: "",
                          embeds: [timeoutEmbed],
                        });
                        client.logger.error("ReactionBuilder", `Error: ${err}`);
                      });
                  })
                  .catch((err: Error) => {
                    MessageTools.edit(MSG, {
                      content: "",
                      embeds: [timeoutEmbed],
                    });
                    client.logger.error("ReactionBuilder", `Error: ${err}`);
                  });
              })
              .catch((err: Error) => {
                MessageTools.edit(MSG, {
                  content: "",
                  embeds: [timeoutEmbed],
                });
                client.logger.error("ReactionBuilder", `Error: ${err}`);
              });
          })
          .catch((err: Error) => {
            MessageTools.edit(MSG, {
              content: "",
              embeds: [timeoutEmbed],
            });
            client.logger.error("ReactionBuilder", `Error: ${err}`);
          });
      })
      .catch((err: Error) => {
        MessageTools.edit(MSG, {
          content: "",
          embeds: [timeoutEmbed],
        });
        client.logger.error("ReactionBuilder", `Error: ${err}`);
      });
  }

  async SlashRun(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}
}
