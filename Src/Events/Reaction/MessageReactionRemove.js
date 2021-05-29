const BaseEvent = require("../../Utils/Structures/BaseEvent")
const Discord = require("discord.js");

//# Schemas
const GuildConfig = require("../../Database/Schema/GuildConfig");
const ReactionSchema = require("../../Database/Schema/ReactionRole");

//! Sets
const ReactionCooldown = new Set();
const ClientCooldown = new Set();

module.exports = class extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: "messageReactionRemove",
    });
  }

  async run(client, reaction, user) {
    //# Ignore the client reactions
    if (client.user === user) return;

    const { message, emoji } = reaction;

    const member = message.guild.members.cache.get(user.id);

    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });

    //find in database
    await ReactionSchema.findOne(
      {
        guildId: message.guild.id,
        reaction: emoji.toString(),
        msgId: message.id,
      },

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

        let guild = this.client.guilds.cache.get(ReactionDB.guildId);
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
        if (ReactionCooldown.has(user.id)) return;

        // Check options
        if (ReactionDB.option === 1) {
          try {
            if (
              member.roles.cache.find(
                (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
              )
            ) {
              await member.roles.remove(rrRole).catch(() => {});
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, 2000);

              if (guildConfig.reactionDM === true) {
                if (ClientCooldown.has(message.guild.id)) return;
                member.send(removeEmbed).catch(() => {});
                ClientCooldown.add(message.guild.id);
                setTimeout(() => {
                  ClientCooldown.delete(message.guild.id);
                }, 4000);
              }
            }
          } catch (err) {
            if (
              !message.channel
                .permissionsFor(message.guild.me)
                .has("SEND_MESSAGES")
            )
              return;

            if (ClientCooldown.has(message.guild.id)) return;
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
            if (ClientCooldown.has(message.guild.id)) return;
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
