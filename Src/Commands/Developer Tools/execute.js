const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const { exec } = require("child_process");


module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'execute',
      category: 'Developer Tools',
      aliases: ['exec', 'exe'],
      usage: '<query>',
      description: 'Executa o Command no Console',
      args: true,
      ownerOnly: true,
    });
  }

  async run(client, message, args) {
    exec(args.join(" "), (error, stdout) => {
        const response = stdout || error;
        message.channel.send(response, { split: true, code: true});
    });
  }
}