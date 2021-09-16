import NDBClient from "@/Client/Client";
import { CommandOptions } from "@Types/Options";
import { BaseCommand } from "@Structures/BaseCommand";
import * as Discord from "discord.js";

module.exports = class TogetherCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const name = "together";
    const options: CommandOptions = {
      client: client,
      name: "together",
      aliases: ["discordgames"],
      description: "Manda um link de convite do discord together selecionado",
      category: "👌 Fun",
      usage: "<Application Name/ID>",
      userPerms: ["SEND_interactionS"],
      botPerms: [""],
      ownerOnly: false,
    };
    super(client, name, options, args);
  }

  async run(client: NDBClient, message: any, args: any) {
    const Timer = 150000
    const Embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("#00c26f")
      .setDescription("Selecione no Menu abaixo o item desejado!")
      .setFooter(client.user.tag, client.user.displayAvatarURL())
      .setTimestamp()
    const GamesComponent = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("Discord-Together")
          .setPlaceholder("Selecione o item desejado")
          .addOptions([
            {
              label: "Youtube",
              value: "Youtube",
              description: "Assistir Youtube na chamada",
              emoji: "730741995416453150"
            },
            {
              label: "Poker",
              value: "Poker",
              description: "Jogar Poker na chamada",
              emoji: "🃏"
            },
            {
              label: "Xadrez",
              value: "Chess",
              description: "Jogar Xadrez na chamada",
              emoji: "♟️"
            },
            {
              label: "Among Us (Betrayal)",
              value: "Betrayal",
              description: "Jogar `Among Us` na chamada",
              emoji: "👨‍🚀"
            },
            {
              label: "Pescaria (Fishing)",
              value: "Fishing",
              description: "Jogar Pescaria na chamada",
              emoji: "🐟"
            }
          ])
      )

    const HE = await message.reply({ embeds: [Embed], components: [GamesComponent] })
    const filter = (interaction) => interaction.user.id === message.author.id;

    const collector = HE.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: Timer });

    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== message.author.id) return;

      const ComponentReaction = interaction.values[0]

      switch (ComponentReaction) {
        case "Youtube":
          if (message.member.voice.channel) {
            client.together.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
              return HE.edit({ content: `${invite.code}`, embeds: [], components: [] })
            })
          } else {
            HE.edit({ content: "Você deve estar em um canal de voz", embeds: [], components: [] })
          }
          break;
        case "Poker":
          if (message.member.voice.channel) {
            client.together.createTogetherCode(message.member.voice.channel.id, 'poker').then(async invite => {
              return HE.edit({ content: `${invite.code}`, embeds: [], components: [] })
            })
          } else {
            HE.edit({ content: "Você deve estar em um canal de voz", embeds: [], components: [] })
          }
          break;
        case "Chess":
          if (message.member.voice.channel) {
            client.together.createTogetherCode(message.member.voice.channel.id, 'chess').then(async invite => {
              return HE.edit({ content: `${invite.code}`, embeds: [], components: [] })
            })
          } else {
            HE.edit({ content: "Você deve estar em um canal de voz", embeds: [], components: [] })
          }
          break;
        case "Betrayal":
          if (message.member.voice.channel) {
            client.together.createTogetherCode(message.member.voice.channel.id, 'betrayal').then(async invite => {
              return HE.edit({ content: `${invite.code}`, embeds: [], components: [] })
            })
          } else {
            HE.edit({ content: "Você deve estar em um canal de voz", embeds: [], components: [] })
          }
          break;
        case "Fishing":
          if (message.member.voice.channel) {
            client.together.createTogetherCode(message.member.voice.channel.id, 'fishing').then(async invite => {
              return HE.edit({ content: `${invite.code}`, embeds: [], components: [] })
            })
          } else {
            HE.edit({ content: "Você deve estar em um canal de voz", embeds: [], components: [] })
          }
          break;
      }
    })
  }

  async SlashRun(client: NDBClient, interaction: Discord.CommandInteraction, args: any) {

  }
};
