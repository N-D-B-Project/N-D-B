const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ReloadCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'reload', //name
      category: 'Developer Tools', //category
      aliases: [''], //aliases
      usage: 'reload <cmdName>', //usage
      description: 'Reinicia algum Comando', //description
      ownerOnly: true
    });
  }

  async run(client, message, args) {
    if(!args[0]) return message.channel.send("Especifique qual Comando devo Reiniciar!");

    let cmdName = args[0].toLowerCase();

    try {
        delete require.cache[require.resolve(`./${cmdName}.js`)]
        client.commands.delete(cmdName);
        const pull = require(`./${cmdName}.js`);
        client.commands.set(cmdName, pull)
    } catch (error) {
        return message.channel.send(`Não consegui reiniciar o comando: \`${args[0].toLowerCase()}\``);
    }

    message.channel.send(`O Comando \`${args[0].toLowerCase()}\` foi reiniciado!`)
  }
}