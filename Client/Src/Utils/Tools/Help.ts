import NDBClient from "@Client/NDBClient";
import BaseCommand from "@Structures/BaseCommand";
import { CommandTools, InteractionTools, MessageTools } from ".";
import * as Discord from "discord.js";
import * as Mongoose from "mongoose";

export default class HelpCommandTools {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async Run(
    msgint: Discord.Message | Discord.CommandInteraction,
    type: "message" | "interaction",
    _Command: BaseCommand
  ) {
    var Tools: any;
    var Collection: Discord.Collection<any, any>;
    if (type === "message") {
      Tools = MessageTools;
      Collection = this.client.Collections.commands;
    } else {
      Tools = InteractionTools;
      Collection = this.client.Collections.SlashCommands;
    }
    const cmdTools: CommandTools = new CommandTools(this.client);
    const guildConfig = await this.client.Mongoose.FindGuildConfig(
      msgint.guild
    );
    const author = msgint.guild.members.cache.get(msgint.member.user.id);
    const channel = msgint.channel as Discord.TextChannel;
    const Timer = 12 * 1000 * 1000;

    var categories = [
      {
        value: "accessibility",
        label: "Accessibility",
        description: await this.client.translate(
          "🌐 Accessibility/help:Selections:Description",
          msgint,
          { Category: "🌐 Accessibility" }
        ),
        emoji: "🌐",
      },
      {
        value: "fun",
        label: "Fun",
        description: await this.client.translate(
          "🌐 Accessibility/help:Selections:Description",
          msgint,
          { Category: "👌 Fun" }
        ),
        emoji: "👌",
      },
      {
        value: "economy",
        label: "Economy",
        description: await this.client.translate(
          "🌐 Accessibility/help:Selections:Description",
          msgint,
          { Category: "💸 Economy" }
        ),
        emoji: "💸",
      },
    ];

    if (author.permissions.has("MANAGE_GUILD")) {
      categories.unshift({
        value: "settings",
        label: "Settings",
        description: await this.client.translate(
          "🌐 Accessibility/help:Selections:Description",
          msgint,
          { Category: "⚙ Settings" }
        ),
        emoji: "⚙",
      });
    }
    if (author.permissions.has("KICK_MEMBERS")) {
      categories.unshift({
        value: "moderation",
        label: "Moderation",
        description: await this.client.translate(
          "🌐 Accessibility/help:Selections:Description",
          msgint,
          { Category: "👮‍♂️ Moderation" }
        ),
        emoji: "👮‍♂️",
      });
    }
    if (channel.nsfw) {
      categories.push({
        value: "nsfw",
        label: "NSFW",
        description: await this.client.translate(
          "🌐 Accessibility/help:Selections:Description",
          msgint,
          { Category: "🔞 NSFW" }
        ),
        emoji: "🔞",
      });
    }
    if (cmdTools.checkOwner(author.id)) {
      categories.unshift({
        value: "devtools",
        label: "Developer Tools",
        description: await this.client.translate(
          "🌐 Accessibility/help:Selections:Description",
          msgint,
          { Category: "🛠 Developer Tools" }
        ),
        emoji: "🛠",
      });
    }

    if(author.permissions.has("MANAGE_ROLES")) {
      categories.push({
        value: "reactionrole",
        label: "Roles",
        description: await this.client.translate("🌐 Accessibility/help:Selections:Description", msgint, { Category: "🎩 Reaction Roles" }),
        emoji: "🎩",
      });
    }

    var CategoriesObject = [
      ...new Set([
        { value: "settings", category: "⚙ Settings" },
        { value: "accessibility", category: "🌐 Accessibility" },
        { value: "fun", category: "👌 Fun" },
        { value: "economy", category: "💸 Economy" },
        { value: "moderation", category: "👮‍♂️ Moderation" },
        { value: "nsfw", category: "🔞 NSFW" },
        { value: "devtools", category: "🛠 Developer Tools" },
        { value: "reactionrole", category: "🎩 Reaction Roles" },
      ]),
    ];

    var CategoriesCase = CategoriesObject.map((object) => {
      return {
        value: object.value,
        category: object.category,
      };
    });

    const Embed = new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setAuthor({
        name: await this.client.translate(
          "🌐 Accessibility/help:Menu:Author",
          msgint,
          {
            ARG: msgint.guild.name,
          }
        ),
        iconURL: msgint.guild.iconURL({ dynamic: true }),
      })
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter({
        text: await this.client.translate(
          "🌐 Accessibility/help:Menu:Footer",
          msgint,
          {
            ARG: author.user.tag,
          }
        ),
        iconURL: author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    if (_Command) {
      Embed.setAuthor({
        name: await this.client.translate(
          "🌐 Accessibility/help:Command:Author",
          msgint,
          { ARG: cmdTools.capitalize(_Command.name) }
        ),
        iconURL: this.client.user.displayAvatarURL(),
      });
      Embed.setDescription(`
        ${await this.client.translate(
          "🌐 Accessibility/help:Command:Description:Aliases",
          msgint,
          {
            ARG: _Command.options.aliases.length
              ? _Command.options.aliases
                  .map((alias) => `\`${alias}\``)
                  .join(" | ")
              : await this.client.translate(
                  "🌐 Accessibility/help:Command:Description:NoAlias",
                  msgint
                ),
          }
        )}
        ${await this.client.translate(
          "🌐 Accessibility/help:Command:Description:Description",
          msgint,
          {
            ARG: `${await this.client.translate(
              `${_Command.options.category}/${_Command.name}:Help:Description`,
              msgint
            )}`,
          }
        )}
        ${await this.client.translate(
          "🌐 Accessibility/help:Command:Description:Category",
          msgint,
          { ARG: _Command.options.category }
        )}
        ${await this.client.translate(
          "🌐 Accessibility/help:Command:Description:Usage",
          msgint,
          {
            ARG: `${guildConfig.get("Settings.Prefix")}${
              _Command.name
            } ${await this.client.translate(
              `${_Command.options.category}/${_Command.name}:Help:Usage`,
              msgint
            )}`,
          }
        )}
      `);
      Tools.reply(msgint, { embeds: [Embed] });
      return;
    } else {
      const MenuEmbed = new Discord.MessageEmbed()
        .setTitle(
          await this.client.translate(
            "🌐 Accessibility/help:Menu2:Title",
            msgint,
            {
              GuildName: msgint.guild.name,
            }
          )
        )
        .setThumbnail(msgint.guild.iconURL({ dynamic: true }))
        .setAuthor({
          name: author.user.tag,
          iconURL: author.displayAvatarURL(),
        })
        .setColor("#00c26f")
        .setURL("http://discord.gg/5CHARxbaRk")
        .setDescription(
          await this.client.translate(
            "🌐 Accessibility/help:Menu2:Description",
            msgint
          )
        )
        .setFooter({
          text: this.client.user.tag,
          iconURL: this.client.user.displayAvatarURL(),
        })
        .setTimestamp();
      const CategoriesComponent = new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("HelpCategories")
          .setPlaceholder(
            await this.client.translate(
              "🌐 Accessibility/help:Selections:Placeholder",
              msgint
            )
          )
          .addOptions(categories)
      );
      const ME = await Tools.reply(msgint, {
        embeds: [MenuEmbed],
        components: [CategoriesComponent],
      });

      const filter = (interaction) => interaction.user.id === author.id;

      const collector = ME.createMessageComponentCollector({
        filter,
        componentType: "SELECT_MENU",
        time: Timer,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.user.id !== author.id) return;

        const ComponentReaction = interaction.values[0];

        CategoriesCase.map(async (object) => {
          switch (ComponentReaction) {
            case String(object.value):
              ME.edit({
                embeds: [
                  new Discord.MessageEmbed()
                    .setAuthor({
                      name: author.user.tag,
                      iconURL: author.displayAvatarURL({
                        dynamic: true,
                      }),
                    })
                    .setTitle(object.category)
                    .setColor("#00c26f")
                    .addField(
                      await this.client.translate(
                        "🌐 Accessibility/help:Menu2:Commands",
                        msgint
                      ),
                      Collection.filter(
                        (cmd) => cmd.options.category === object.category
                      )
                        .map((cmd) => `\`${cmd.name}\``)
                        .join(" | ")
                    )
                    .setFooter({
                      text: this.client.user.tag,
                      iconURL: this.client.user.displayAvatarURL(),
                    })
                    .setTimestamp(),
                ],
              });
              break;
          }
        });
      });
    }
  }
}
