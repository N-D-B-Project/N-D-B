const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");
const moment = require("moment");

//# Schemas
const GuildConfig = require("../../Database/Schema/GuildConfig");
const ReactionSchema = require("../../Database/Schema/ReactionRole");

//! Sets
const ReactionCooldown = new Set();
const ClientCooldown = new Set();

module.exports = class MessageReactionAddEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: "messageReactionAdd",
    });
  }

  async run(client, reaction, user) {
    const { message, emoji } = reaction;
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });

    //# Ignore the client reactions
    if (client.user === user) return;

    const member = message.guild.members.cache.get(user.id);

    await ReactionSchema.findOne(
      { guildId: message.guild.id, reaction: emoji.toString(), msgId: message.id },
      async (err, ReactionDB) => {
        // Return se não houver uma DB
        if (!ReactionDB) return;

        // Return se o id da mensagem for diferente da DB
        if (message.id != ReactionDB.msgId) return;

        // Encontra o cargo para adicionar-lo ao membro
        const rrRole = message.guild.roles.cache.get(ReactionDB.roleId);

        // Return se nãO houver um cargo
        if (!rrRole) return;

        // Return (Evitar RateLimit+ SPAM)
        if (ClientCooldown.has(message.guild.id)) return;

        let guild = client.guilds.cache.get(ReactionDB.guildId);
        let guildName = guild.name;

        // Cooldown embed
        let CooldownEmbed = new Discord.MessageEmbed()
          .setColor("#00c26f")
          .setDescription(
            `Você está no Cooldown\n\n**Nome do Cargo:** ${rrRole.name}\n**Nome do Servidor:** ${guildName}`
          )
          .setTimestamp();
        // RoleAdd embed
        let addEmbed = new Discord.MessageEmbed()
          .setAuthor("Cargo Adicionado", `${message.url}`)
          .setDescription(
            `Você recebeu o Cargo: **${rrRole.name}** em **${guildName}**`
          )
          .setColor("#00c26f")
          .setTimestamp();
        // RemoveRole embed
        let removeEmbed = new Discord.MessageEmbed()
          .setAuthor("Cargo Removido", `${message.url}`)
          .setDescription(
            `Você não tem mais o Cargo: **${rrRole.name}** em **${guildName}**`
          )
          .setColor("#00c26f")
          .setTimestamp();
        // Reaction Error embed
        let errEmbed = new Discord.MessageEmbed()
          .setAuthor("Reaction Error", `${message.url}`)
          .setDescription(
            `Falha ao adicionar o cargo: **${rrRole.name}** em **${guildName}**`
          )
          .setColor("#00c26f")
          .setTimestamp();
        // Check se o user está no cooldown
        if (ReactionCooldown.has(user.id)) {
          user.send(CooldownEmbed).catch(() => {});
          ClientCooldown.add(message.guild.id);
          setTimeout(() => {
            ClientCooldown.delete(message.guild.id);
          }, 4000);
        }

        

        if (ReactionDB.option === 1) {
          try {
            if (
              !member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.add(rrRole).catch(() => {});
              if (guildConfig.reactionDM === true) {
                member.send(addEmbed).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            ClientCooldown.add(message.guild.id);
            setTimeout(() => {
              ClientCooldown.delete(message.guild.id);
            }, 6000);
            return member.send(errEmbed).catch(() => {});
          }
        }

        if (ReactionDB.option === 2) {
          try {
            if (
              !member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.add(rrRole).catch(() => {});
              if (guildConfig.reactionDM === true) {
                member.send(addEmbed).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            ClientCooldown.add(message.guild.id);
            setTimeout(() => {
              ClientCooldown.delete(message.guild.id);
            }, 6000);
            return member.send(errEmbed).catch(() => {});
          }
        }

        if (ReactionDB.option === 3) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.remove(rrRole).catch(() => {});
              if (guildConfig.reactionDM === true) {
                member.send(removeEmbed).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            ClientCooldown.add(message.guild.id);
            setTimeout(() => {
              ClientCooldown.delete(message.guild.id);
            }, 6000);
            return member.send(errEmbed).catch(() => {});
          }
        }

        if (ReactionDB.option === 4) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.remove(rrRole).catch(() => {});
              ReactionCooldown.add(user.id);
              if (guildConfig.reactionDM === true) {
                member.send(removeEmbed).catch(() => {});
              }
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            ClientCooldown.add(message.guild.id);
            setTimeout(() => {
              ClientCooldown.delete(message.guild.id);
            }, 6000);
            return member.send(errEmbed).catch(() => {});
          }
        }

        if (ReactionDB.option === 5) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.remove(rrRole);
              message.reactions.cache
                .find((r) => r.emoji.name == emoji.name)
                .users.remove(user.id)
                .catch(() => {});

              if (guildConfig.reactionDM === true) {
                member.send(removeEmbed).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 2000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            ClientCooldown.add(message.guild.id);
            setTimeout(() => {
              ClientCooldown.delete(message.guild.id);
            }, 6000);
            return member.send(errEmbed).catch(() => {});
          }
        }

        if (ReactionDB.option === 6) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              message.reactions.cache
                .find((r) => r.emoji.name == emoji.name)
                .users.remove(user.id)
                .catch(() => {});
              await member.roles.remove(rrRole).catch(() => {});

              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 5000);

              return;
            } else if (
              !member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              message.reactions.cache
                .find((r) => r.emoji.name == emoji.name)
                .users.remove(user.id)
                .catch(() => {});
              await member.roles.add(rrRole).catch(() => {});

              if (guildConfig.reactionDM === true) {
                member.send(addEmbed).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 5000);
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;
            ClientCooldown.add(message.guild.id);
            setTimeout(() => {
              ClientCooldown.delete(message.guild.id);
            }, 6000);
            return member.send(errEmbed).catch(() => {});
          }
        }
      }
    );
  }
};
