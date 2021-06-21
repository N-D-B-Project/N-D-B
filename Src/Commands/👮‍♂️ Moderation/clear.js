const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ClearCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'clear',
      category: '👮‍♂️ Moderation',
      aliases: ['limpar'],
      usage: 'clear <Nº de 1 a 100>',
      description: 'Limpa a quantidade de mensagens de acordo com o Nº dito ao utilizar o comando',
      userPerms: ["MANAGE_MESSAGES"]
    });
  }

  async run(client, message, args) {
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 1 || deleteCount > 100)
      return message.inlineReply("__Forneça um numero de 1/99 para deletar as mensagens__.");
    const fetched = await message.channel.messages.fetch({
      limit: deleteCount + 1,
    });
    message.channel.bulkDelete(fetched);
    message.delete().catch((O_o) => {});
    message.channel
      .send(`🗑 ${args[0]}`, `mensagens deletadas!`)
      .catch((error) =>
        console.error(`Não foi possível deletar as mensagens devido a: ${error}`)
      );
  }
};
