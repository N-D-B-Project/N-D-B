const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'reloadplayer',
      category: 'Music',
      aliases: ['rebootplayer', 'rplayer'],
      usage: '',
      description: 'Reinicia o Player do Bot',
      userPerms: ["MANAGE_GUILD"],
    });
  }

  async run(client, message, args) {
    const player = message.client.music.players.get(message.guild.id);
    message.channel.send("Reiniciando o Player...")
    player.destroy(player.guild.id);
  }
}