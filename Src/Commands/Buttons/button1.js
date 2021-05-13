const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class B1Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'b1',
      category: 'Developer Tools',
      aliases: [''],
      ownerOnly: true,
    });
  }

  async run(client, message, args, prefix) {
    message.inlineReply("Buttons!")
    message.buttons("Hello World!", {
        buttons: [
            {
                style: 'green',
                label: 'Click to function!',
                id: 'click_to_function'
            },
            {
                style: 'url',
                label: 'Vote for me!',
                url: 'https://top.gg/bot/708822043420000366/vote'
            }
        ]
    })
  }
}