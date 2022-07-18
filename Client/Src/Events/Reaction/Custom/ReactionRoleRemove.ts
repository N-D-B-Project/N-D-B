import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { EventOptions, ReactionsType } from "~/Types";
import { MessageTools } from "~/Utils/Tools";
import { ReactionRole as Schema } from "@Database/Schemas";
import { MessageReaction, User, EmbedBuilder } from "discord.js";

export default class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ReactionRoleRemove",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, reaction: MessageReaction, user: User) {
    if (user === client.user) return;
    const TIMER: number = 10 * 1000;
    const ReactionCooldown = new Set();
    const ClientCooldown = new Set();
    const CONFIG = await Schema.findOne({
      ID: reaction.message.guildId,
    });
    var GetReactions = CONFIG.get("Reactions");
    const Guild = client.guilds.cache.get(CONFIG.get("ID"));
    const Member = reaction.message.guild.members.cache.get(user.id);

    GetReactions.forEach(async (Data: ReactionsType) => {
      const Role = Guild.roles.cache.get(Data.role);
      const Message = Data.message;
      const Channel = Data.channel;
      const Emoji = Guild.emojis.cache.get(Data.emoji);
      const Option = Data.option;

      if (ClientCooldown.has(reaction.message.guildId)) return;

      const CooldownEmbed = new EmbedBuilder()
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
        })
        .setTitle(
          await client.translate(
            "Events/ReactionRoleAdd:Cooldown:Title",
            reaction.message
          )
        )
        .setDescription(
          await client.translate(
            "Events/ReactionRoleAdd:Cooldown:Description",
            reaction.message,
            { GUILD: Guild.name, TIMER }
          )
        )
        .addFields([
          {
            name: await client.translate(
              "Events/ReactionRoleAdd:GlobalField:1",
              reaction.message
            ),
            value: await client.translate(
              "Events/ReactionRoleAdd:GlobalField:Content",
              reaction.message,
              {
                URL: `https://com/channels/${Guild.id}/${Channel}/${Message}`,
              }
            ),
          },
        ])
        .setFooter({
          text: await client.translate(
            "Events/ReactionRoleAdd:GlobalFooter",
            reaction.message
          ),
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor("#c20e00")
        .setTimestamp();
      const AddEmbed = new EmbedBuilder()
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
        })
        .setTitle(
          await client.translate(
            "Events/ReactionRoleAdd:Add:Title",
            reaction.message
          )
        )
        .setDescription(
          await client.translate(
            "Events/ReactionRoleAdd:Add:Description",
            reaction.message,
            { ROLE: `<@&${Role}>`, GUILD: Guild.name }
          )
        )
        .addFields([
          {
            name: await client.translate(
              "Events/ReactionRoleAdd:GlobalField:1",
              reaction.message
            ),
            value: await client.translate(
              "Events/ReactionRoleAdd:GlobalField:Content",
              reaction.message,
              {
                URL: `https://com/channels/${Guild.id}/${Channel}/${Message}`,
              }
            ),
          },
        ])
        .setFooter({
          text: await client.translate(
            "Events/ReactionRoleAdd:GlobalFooter",
            reaction.message
          ),
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor("#00c26f")
        .setTimestamp();
      const RemoveEmbed = new EmbedBuilder()
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
        })
        .setTitle(
          await client.translate(
            "Events/ReactionRoleAdd:Remove:Title",
            reaction.message,
            {}
          )
        )
        .setDescription(
          await client.translate(
            "Events/ReactionRoleAdd:Remove:Description",
            reaction.message,
            { ROLE: `<@&${Role}>`, GUILD: Guild.name }
          )
        )
        .addFields([
          {
            name: await client.translate(
              "Events/ReactionRoleAdd:GlobalField:1",
              reaction.message
            ),
            value: await client.translate(
              "Events/ReactionRoleAdd:GlobalField:Content",
              reaction.message,
              {
                URL: `https://com/channels/${Guild.id}/${Channel}/${Message}`,
              }
            ),
          },
        ])
        .setFooter({
          text: await client.translate(
            "Events/ReactionRoleAdd:GlobalFooter",
            reaction.message
          ),
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor("#00c26f")
        .setTimestamp();
      const ErrorEmbed = new EmbedBuilder()
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ extension: "gif", size: 512 }),
        })
        .setTitle(
          await client.translate(
            "Events/ReactionRoleAdd:Error:Title",
            reaction.message
          )
        )
        .setDescription(
          await client.translate(
            "Events/ReactionRoleAdd:Error:Description",
            reaction.message,
            { ROLE: `<@&${Role}>`, GUILD: Guild.name }
          )
        )
        .addFields([
          {
            name: await client.translate(
              "Events/ReactionRoleAdd:GlobalField:1",
              reaction.message
            ),
            value: await client.translate(
              "Events/ReactionRoleAdd:GlobalField:Content",
              reaction.message,
              {
                URL: `https://com/channels/${Guild.id}/${Channel}/${Message}`,
              }
            ),
          },
        ])
        .setFooter({
          text: await client.translate(
            "Events/ReactionRoleAdd:GlobalFooter",
            reaction.message
          ),
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor("#c20e00")
        .setTimestamp();

      if (Option === 1) {
        try {
          if (
            Member.roles.cache.find(
              (r) => r.name.toLowerCase() === Role.name.toLowerCase()
            )
          ) {
            await Member.roles.remove(Role).catch(() => {});
            ReactionCooldown.add(user.id);
            setTimeout(() => {
              ReactionCooldown.delete(user.id);
            }, 2000);

            if (CONFIG.get("DMInfoMSG") === true) {
              if (ClientCooldown.has(reaction.message.guildId)) return;
              MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(
                () => {}
              );
              ClientCooldown.add(reaction.message.guildId);
              setTimeout(() => {
                ClientCooldown.delete(reaction.message.guildId);
              }, 4000);
            }
          }
        } catch (err) {
          if (ClientCooldown.has(reaction.message.guildId)) return;
          ClientCooldown.add(reaction.message.guildId);
          setTimeout(() => {
            ClientCooldown.delete(reaction.message.guildId);
          }, 6000);
          MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
        }
      }

      if (Option === 4) {
        try {
          if (
            !Member.roles.cache.find(
              (r) => r.name.toLowerCase() === Role.name.toLowerCase()
            )
          ) {
            await Member.roles.add(Role).catch(() => {});
            if (CONFIG.get("DMInfoMSG") === true) {
              MessageTools.send(user, { embeds: [AddEmbed] }).catch(() => {});
            }
            ReactionCooldown.add(user.id);
            setTimeout(() => {
              ReactionCooldown.delete(user.id);
            }, 2000);
          }
        } catch (err) {
          if (ClientCooldown.has(reaction.message.guildId)) return;
          ClientCooldown.add(reaction.message.guildId);
          setTimeout(() => {
            ClientCooldown.delete(reaction.message.guildId);
          }, 6000);
          MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
        }
      }
    });
  }
}
