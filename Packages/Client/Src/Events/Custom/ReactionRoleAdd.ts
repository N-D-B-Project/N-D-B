import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { EventOptions, ReactionsType } from "~/Types";
import { MessageTools } from "~/Utils/Tools";
import { GuildConfig as Schema } from "@Database/Schemas";
import { EmbedBuilder, MessageReaction, User } from "discord.js";

export default class ReactionRoleAddEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ReactionRoleAdd",
      type: "on",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(client: NDBClient, reaction: MessageReaction, user: User) {
    if (user === client.user) return;
    var Verify: boolean = true;
    const TIMER: number = 10 * 1000;
    const ReactionCooldown = new Set();
    const ClientCooldown = new Set();
    const CONFIG = await Schema.findOne({
      ID: reaction.message.guildId,
    });
    var GetReactions = CONFIG.get("ReactionRoles");
    const Guild = client.guilds.cache.get(CONFIG.get("ID"));
    const Member = reaction.message.guild.members.cache.get(user.id);
    if (!CONFIG) return;

    GetReactions.forEach(async (Data: ReactionsType) => {
      const SplitEmoji = Data.emoji.replace("<:", "").replace(">", "");

      if (
        reaction.emoji.identifier === SplitEmoji &&
        reaction.message.id === Data.message
      ) {
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
                  URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
                }
              ),
            },
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
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
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Add:Title",
              reaction.message
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Add:Description",
              reaction.message,
              { ROLE: Role.name, GUILD: Guild.name }
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
                  URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
                }
              ),
            },
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
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
              { ROLE: Role.name, GUILD: Guild.name }
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
                  URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
                }
              ),
            },
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
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
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Error:Title",
              reaction.message
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Error:Description",
              reaction.message,
              { ROLE: Role.name, GUILD: Guild.name }
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
                  URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`,
                }
              ),
            },
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL(),
          })
          .setColor("#c20e00")
          .setTimestamp();

        if (Option === 1) {
          try {
            if (
              !Member.roles.cache.find(
                (r) => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .add(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:ADD:1",
                    reaction.message
                  )
                )
                .catch(() => {});
              if (CONFIG.get("DMInfoMSG") === true) {
                MessageTools.send(user, {
                  embeds: [AddEmbed],
                }).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (error) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, {
              embeds: [ErrorEmbed],
            });
            return;
          }
        }

        if (Option === 2) {
          try {
            if (
              !Member.roles.cache.find(
                (r) => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .add(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:ADD:2",
                    reaction.message
                  )
                )
                .catch(() => {});
              if (CONFIG.get("Systems:Logs:ReactionDM") === true) {
                MessageTools.send(user, { embeds: [AddEmbed] }).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }

        if (Option === 3) {
          try {
            if (
              Member.roles.cache.find(
                (r) => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .remove(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:REMOVE:3",
                    reaction.message
                  )
                )
                .catch(() => {});
              if (CONFIG.get("Systems:Logs:ReactionDM") === true) {
                MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(
                  () => {}
                );
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }

        if (Option === 4) {
          try {
            if (
              Member.roles.cache.find(
                (r) => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .remove(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:REMOVE:4",
                    reaction.message
                  )
                )
                .catch(() => {});
              ReactionCooldown.add(user.id);
              if (CONFIG.get("Systems:Logs:ReactionDM") === true) {
                MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(
                  () => {}
                );
              }
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }

        if (Option === 5) {
          try {
            if (
              Member.roles.cache.find(
                (r) => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles.remove(
                Role,
                await client.Translate.Guild(
                  "Events/ReactionRoleAdd-Remove:Options:REMOVE:5",
                  reaction.message
                )
              );
              reaction.message.reactions.cache
                .find((r) => r.emoji.name == Emoji.name)
                .users.remove(user.id)
                .catch(() => {});

              if (CONFIG.get("Systems:Logs:ReactionDM") === true) {
                MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(
                  () => {}
                );
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }

        if (Option === 6) {
          try {
            if (
              Member.roles.cache.find(
                (r) => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              reaction.message.reactions.cache
                .find((r) => r.emoji.name == Emoji.name)
                .users.remove(user.id)
                .catch(() => {});
              await Member.roles
                .remove(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:REMOVE:6",
                    reaction.message
                  )
                )
                .catch(() => {});

              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);

              return;
            } else if (
              !Member.roles.cache.find(
                (r) => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              reaction.message.reactions.cache
                .find((r) => r.emoji.name == Emoji.name)
                .users.remove(user.id)
                .catch(() => {});
              await Member.roles
                .add(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:ADD:6",
                    reaction.message
                  )
                )
                .catch(() => {});

              if (CONFIG.get("Systems:Logs:ReactionDM") === true) {
                MessageTools.send(user, { embeds: [AddEmbed] }).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, 6000);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }
      }
    });
  }
}
