/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactionRole from "@/Modules/ReactionRole";
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { EmbedBuilder, MessageReaction, User, roleMention } from "discord.js";

export default class Event extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "ReactionRoleRemove",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, reaction: MessageReaction, user: User) {
    if (user === client.user) return;
    const react = new ReactionRole(client, "ReactionRoleAddEvent");
    const TIMER: number = 10 * 1000;
    const ReactionCooldown = new Set();
    const ClientCooldown = new Set();
    const data = await react.getAll(reaction.message.guild);
    const GuildData = await client.database.GuildRepo.get(
      reaction.message.guildId
    );
    const Member = reaction.message.guild.members.cache.get(user.id);
    const Guild = reaction.message.guild;
    if (!data) return;

    data.forEach(async Data => {
      const SplitEmoji = Data.Emoji.replace("<:", "").replace(">", "");

      if (
        reaction.emoji.identifier === SplitEmoji &&
        reaction.message.id === Data.Message
      ) {
        const Role = Guild.roles.cache.get(Data.Role);
        const Message = Data.Message;
        const Channel = Data.Channel;
        const Emoji = Guild.emojis.cache.get(Data.Emoji);
        const Option = Data.Option;

        if (ClientCooldown.has(reaction.message.guildId)) return;

        const CooldownEmbed = new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ extension: "gif", size: 512 })
          })
          .setTitle(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Cooldown:Title",
              reaction.message
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Cooldown:Description",
              reaction.message,
              { GUILD: Guild.name, TIMER }
            )
          )
          .addFields([
            {
              name: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:1",
                reaction.message
              ),
              value: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:Content",
                reaction.message,
                {
                  URL: `https://com/channels/${Guild.id}/${Channel}/${Message}`
                }
              )
            }
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL()
          })
          .setColor("#c20e00")
          .setTimestamp();
        const AddEmbed = new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ extension: "gif", size: 512 })
          })
          .setTitle(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Add:Title",
              reaction.message
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Add:Description",
              reaction.message,
              { ROLE: roleMention(Role.id), GUILD: Guild.name }
            )
          )
          .addFields([
            {
              name: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove-Remove:GlobalField:1",
                reaction.message
              ),
              value: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:Content",
                reaction.message,
                {
                  URL: `https://com/channels/${Guild.id}/${Channel}/${Message}`
                }
              )
            }
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL()
          })
          .setColor("#00c26f")
          .setTimestamp();
        const RemoveEmbed = new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ extension: "gif", size: 512 })
          })
          .setTitle(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Remove:Title",
              reaction.message,
              {}
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Remove:Description",
              reaction.message,
              { ROLE: roleMention(Role.id), GUILD: Guild.name }
            )
          )
          .addFields([
            {
              name: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:1",
                reaction.message
              ),
              value: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:Content",
                reaction.message,
                {
                  URL: `https://com/channels/${Guild.id}/${Channel}/${Message}`
                }
              )
            }
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL()
          })
          .setColor("#00c26f")
          .setTimestamp();
        const ErrorEmbed = new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ extension: "gif", size: 512 })
          })
          .setTitle(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Error:Title",
              reaction.message
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Error:Description",
              reaction.message,
              { ROLE: roleMention(Role.id), GUILD: Guild.name }
            )
          )
          .addFields([
            {
              name: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:1",
                reaction.message
              ),
              value: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:Content",
                reaction.message,
                {
                  URL: `https://com/channels/${Guild.id}/${Channel}/${Message}`
                }
              )
            }
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL()
          })
          .setColor("#c20e00")
          .setTimestamp();

        if (Option === 1) {
          try {
            if (
              Member.roles.cache.find(
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .remove(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:REMOVE:1",
                    reaction.message
                  )
                )
                .catch(() => {});
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 2000);

              if (GuildData.Settings.ReactionDM) {
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
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .add(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:ADD:4",
                    reaction.message
                  )
                )
                .catch(() => {});
              if (GuildData.Settings.ReactionDM) {
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
      }
    });
  }
}
