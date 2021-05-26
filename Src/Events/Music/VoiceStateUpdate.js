const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");
const MusicConfig = require("../../Config/MusicConfig.json");
const ms = require("ms");

module.exports = class voiceStateUpdateEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: "voiceStateUpdate",
    });
  }
  async run(client, oldState, newState) {
    if (
      newState.id === client.user.id &&
      oldState.serverDeaf === true &&
      newState.serverDeaf === false
    ) {
      try {
        const channel = newState.member.guild.channels.cache.find(
          (channel) =>
            channel.type === "text" &&
            (channel.name.toLowerCase().includes("cmd") ||
              channel.name.toLowerCase().includes("command") ||
              channel.toLowerCase().name.includes("bot")) &&
            channel
              .permissionsFor(newState.member.guild.me)
              .has("SEND_MESSAGES")
        );
        channel.send("Não ative meu Audio!");
        newState.setDeaf(true);
      } catch (error) {
        try {
          client.logger.error(".");
          const channel = newState.member.guild.channels.cache.find(
            (channel) =>
              channel.type === "text" &&
              channel
                .permissionsFor(newState.member.guild.me)
                .has("SEND_MESSAGES")
          );
          channel.send("Não ative meu Audio!");
          newState.setDeaf(true);
        } catch (error) {
          client.logger.log(".");
          newState.setDeaf(true);
        }
      }
    }
    if (oldState.channelID && !newState.channelID) {
      try {
        if (oldState.member.user.id === client.user.id) {
          var player = client.music.players.get(oldState.guild.id);
          if (!player) return;
          player.destroy();
        }
      } catch {}
    }
    var player = client.music.players.get(newState.guild.id);
    if (!player) return;
    if (
      MusicConfig.settings.leaveOnEmpty_Channel.enabled &&
      oldState &&
      oldState.channel
    ) {
      player = client.music.players.get(oldState.guild.id);
      if (!oldState.guild.me.voice.channel) return player.destroy();
      if (
        player &&
        oldState.guild.channels.cache.get(player.voiceChannel).members.size ===
          1
      ) {
        setTimeout(() => {
          try {
            player = client.music.players.get(oldState.guild.id);
            if (!oldState.guild.me.voice.channel && player)
              return player.destroy();
            if (
              player &&
              oldState.guild.channels.cache.get(player.voiceChannel).members
                .size === 1
            ) {
              var embed = new MessageEmbed()
                .setTitle(`Fila de Musicas acabou | `)
                .setDescription(
                  `Eu Sai do Canal: ${
                    client.channels.cache.get(player.voiceChannel).name
                  } pois ele ficou vazio por: ${ms(
                    config.settings.leaveOnEmpty_Channel.time_delay,
                    { long: true }
                  )}`
                )
                .setColor("#00c26f")
                .setFooter(client.user.tag, client.user.displayAvatarURL());
              if (
                player.get(`afk-${player.get("playerauthor")}`) ||
                player.get(`afk-${player.guild}`)
              )
                return client.channels.cache
                  .get(player.textChannel)
                  .send(
                    embed.setDescription(
                      `Não irei sair do Canal pois o Modo AFK está Ativo ✔`
                    )
                  )
                  .then((msg) => {
                    try {
                      msg
                        .delete({
                          timeout: 4000,
                        })
                        .catch((e) => client.logger.warn("Anti-Crash"));
                    } catch {
                      /* */
                    }
                  });
              client.channels.cache
                .get(player.textChannel)
                .send(embed)
                .then((msg) => {
                  try {
                    msg
                      .delete({
                        timeout: 4000,
                      })
                      .catch((e) => client.logger.warn("Anti-Crash"));
                  } catch {
                    /* */
                  }
                });
              try {
                client.channels.cache
                  .get(player.textChannel)
                  .messages.fetch(player.get("playermessage"))
                  .then((msg) => {
                    try {
                      msg
                        .delete({
                          timeout: 4000,
                        })
                        .catch((e) => client.logger.warn("Anti-Crash"));
                    } catch {
                      /* */
                    }
                  });
              } catch (error) {
                client.logger.log(String(e.stack));
              }
              player.destroy();
            }
          } catch (error) {
            client.logger.log(String(error.stack));
          }
        }, MusicConfig.settings.leaveOnEmpty_Channel.time_delay);
      }
    }
  }
};
