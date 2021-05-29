const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");

const ReactionRole = require("../../Packages/ReactionRole/index.js");
const GuildConfig = require("../../Database/Schema/GuildConfig");
const react = new ReactionRole();

module.exports = class ReactionBuilder extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "reactionbuilder",
      aliases: [
        "rrb",
        "reactionrolebuilder",
        "reactionbuilder",
        "rolebuilder",
        "rrbuilder",
      ],
      description: "Inicia a criação de uma Reaction Role",
      category: "🎨 ReactionRole",
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(client, message, args) {
    let fail = client.emoji.fail;
    let success = client.emoji.success;

    const cancelEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`${success} Reaction Builder Cancelado!`);

    const cancelEmbed2 = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`${fail} Resposta Errada, Reaction Builder Cancelado!`);

    const timeEnd = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`${fail} Tempo Acabou, Reaction Builder Cancelado!`);
    const filter = (m) => m.author.id === message.author.id;

    message.channel.send("Por favor especifique o Canal! **[Canal / ID]**\n\n**Diga `cancelar` para cancelar a operação**").then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then(async (collected) => {
            let channel = collected.first().content;
            let channelMention = collected.first().mentions;
            let channelToSend =
              channelMention.channels.first() ||
              message.guild.channels.cache.get(channel.toLowerCase()) ||
              message.guild.channels.cache.find(
                (ch) => ch.name === channel.toLowerCase()
              );

            if (channel.toLowerCase() === "cancelar") {
              message.channel.send(cancelEmbed);
              return;
            }

            if (!channelToSend) return message.channel.send(cancelEmbed2);

            message.channel.send(`Especifique o ID da Mensagem\n\nCertifique-se que a mensagem seja do canal: ${channelToSend}\n\n**Diga \`cancelar\` para cancelar a operação**` ).then(() => {
                message.channel
                  .awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                  })
                  .then(async (collected1) => {
                    let ID = collected1.first().content;
                    if (ID.toLowerCase() === "cancelar") {
                      message.channel.send(cancelEmbed);
                      return;
                    }
                    let messageID = await channelToSend.messages
                      .fetch(ID)
                      .catch(() => {
                        return message.channel.send(cancelledEmbed2);
                      });

                    message.channel
                      .send(
                        "Por favor especifique o Cargo! **[Cargo / ID]**\n\nO Cargo será dado a pessoa que reagir\n\n**Diga `cancelar` para cancelar a operação**"
                      )
                      .then(() => {
                        message.channel
                          .awaitMessages(filter, {
                            max: 1,
                            time: 60000,
                            errors: ["time"],
                          })
                          .then((collected2) => {
                            let roleName = collected2.first().content;
                            let roleMention = collected2.first().mentions;
                            let role =
                              roleMention.roles.first() ||
                              message.guild.roles.cache.find(
                                (rl) => rl.name === roleName
                              ) ||
                              message.guild.roles.cache.get(roleName);
                            if (roleName.toLowerCase() === "cancelar") {
                              message.channel.send(cancelEmbed);
                              return;
                            }
                            if (!role)
                              return message.channel.send(cancelEmbed2);
                            if (role.managed) {
                              return message.channel.send(
                                `${client.emojis.fail} Não utilize Cargos de Integrações`
                              );
                            }

                            message.channel
                              .send(
                                "Por favor defina um Emoji, Certifique-se de não ser um Emoji Customizado\n\nO Emoji será o emoji ao qual o usuário reagirá!\n\n**Diga `Cancelar` para cancelar a operação**"
                              )
                              .then(() => {
                                message.channel
                                  .awaitMessages(filter, {
                                    max: 1,
                                    time: 60000,
                                    errors: ["time"],
                                  })
                                  .then(async (collected3) => {
                                    let emoji = collected3.first().content;

                                    if (!emoji)
                                      return message.channel.send(
                                        new Discord.MessageEmbed()
                                          .setAuthor(
                                            message.author.tag,
                                            message.author.displayAvatarURL()
                                          )
                                          .setDescription(
                                            `${fail} Emoji invalido`
                                          )
                                          .setColor("#00c26f")
                                      );

                                    if (isCustomEmoji(emoji))
                                      return message.channel.send(
                                        new Discord.MessageEmbed()
                                          .setAuthor(
                                            message.author.tag,
                                            message.author.displayAvatarURL()
                                          )
                                          .setDescription(
                                            `${fail} Não utilize Emojis customizados`
                                          )
                                          .setColor("#00c26f")
                                      );

                                    try {
                                      await messageID.react(emoji);
                                    } catch (err) {
                                      return message.channel.send(
                                        new Discord.MessageEmbed()
                                          .setAuthor(
                                            message.author.tag,
                                            message.author.displayAvatarURL()
                                          )
                                          .setDescription(
                                            `${fail} PEmoji invalido`
                                          )
                                          .setColor("#00c26f")
                                      );
                                    }

                                    message.channel
                                      .send(
                                        "__**Finalmente escolha :**__\n\n`1` - Reagir adiciona o Cargo, tirar a reação remove o Cargo \n`2`- Reagir adiciona o Cargo, tirar a reação não remove o Cargo \n`3` - Reagir removerá o Cargo do usuário, tirar a reação não a devolverá o Cargo ao usuário \n`4` - Reagir removerá o Cargo, tirar a reação adiciona o Cargo \n`5` - Mesmo conceito do número 3 porém remove a reação do usuário\n`6` - Reagir para receber o Cargo e reagir novamene para remover o Cargo"
                                      )
                                      .then(() => {
                                        message.channel
                                          .awaitMessages(filter, {
                                            max: 1,
                                            time: 60000,
                                            errors: ["time"],
                                          })
                                          .then((collected4) => {
                                            let option =
                                              collected4.first().content;
                                            let numbers = [
                                              "1",
                                              "2",
                                              "3",
                                              "4",
                                              "5",
                                              "6",
                                            ];
                                            if (!numbers.includes(option))
                                              return message.channel.send(
                                                "Escolha uma das seguintes opções: 1, 2, 3, 4 ou 5"
                                              );

                                            message.channel
                                              .send(
                                                new Discord.MessageEmbed()
                                                  .setAuthor(
                                                    "Reaction Roles - Configuração concluída",
                                                    message.guild.iconURL(),
                                                    messageID.url
                                                  )
                                                  .setColor("#00c26f")
                                                  .addField(
                                                    "Canal",
                                                    channelToSend,
                                                    true
                                                  )
                                                  .addField(
                                                    "Emoji",
                                                    emoji,
                                                    true
                                                  )
                                                  .addField(
                                                    "Tipo",
                                                    option,
                                                    true
                                                  )
                                                  .addField(
                                                    "MessageID",
                                                    ID,
                                                    true
                                                  )
                                                  .addField(
                                                    "Mensagem",
                                                    `[Clique Aqui](${messageID.url})`,
                                                    true
                                                  )
                                                  .addField("Cargo", role, true)
                                              )
                                              .then(async () => {
                                                messageID.react(emoji);

                                                await react.reactionCreate(
                                                  client,
                                                  message.guild.id,
                                                  ID,
                                                  role.id,
                                                  emoji,
                                                  "false",
                                                  option
                                                );
                                              });
                                          })
                                          .catch((err) => {
                                            message.channel.send(timeEnd);
                                            console.log(err)
                                          });
                                      });
                                  })
                                  .catch((err) => {
                                    message.channel.send(timeEnd);
                                    console.log(err)
                                  });
                              });
                          })
                          .catch((err) => {
                            message.channel.send(timeEnd);
                            console.log(err)
                          });
                      });
                  })
                  .catch((err) => {
                    message.channel.send(timeEnd);
                    console.log(err);
                  });
              });
          })
          .catch((err) => {
            message.channel.send(timeEnd);
            console.log(err)
          });
      });

    function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }
  }
};
