const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const exec = require("child_process");

module.exports = class RebootCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'reboot',
      category: 'Developer Tools',
      aliases: ['reiniciar'],
      usage: '', //usage
      description: 'Reinicia o Bot',
      ownerOnly: true
    });
  }

  async run(client, message, args) {
    message.channel.send("Reiniciando o Bot...");
    // process.exit();
    // console.log("rs");
    // exec(rs);
    // client.destroy();
  }
}