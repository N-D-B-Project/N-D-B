const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const { Types } = require("mongoose");
const Disable = require("../../database/schemas/DisableCommands");

module.exports = class DisableCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'disable',
      category: 'Developer Tools',
      aliases: ['desabilitar'],
      usage: 'disable <cmdName>',
      description: 'Desabilita um Comando',
      ownerOnly: true,
    });
  }

  async run(client, message, args) {
    // if (!args.length) return message.channel.send("Diga qual comando devo desabilitar");
    // let command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
    // if (!command) return message.channel.send("Esse comando não existe");
    // Disable.findOne({
    //     name: "global"
    // }, (err, data) => {
    //         if (err) console.log(err);
    //         if (!data) {
    //             const disable = new Disable({
    //                 //_id: Types.ObjectId(),
    //                 name: "global",
    //                 cmds: []
    //             })
    //             disable.cmds.push(command);
    //             disable.save()
    //                 .catch(e => console.log(e));
    //             //console.log(disable);
    //         } else {
    //             //console.log(data);
    //             data.cmds.push(command);
    //             data.save()
    //                 .catch(e => console.log(e));
    //         }
    //         return message.channel.send(`Comando \`${command.name}\` desabilitado!`);
    // })
  }
}