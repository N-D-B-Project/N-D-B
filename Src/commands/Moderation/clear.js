const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class clear extends BaseCommand {
  constructor() {
    super("clear", "Moderation", []);
  }

  async run(client, message, args) {
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.reply("Lhe faltam permissões para isso");
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 1 || deleteCount > 99)
      return message.reply(
        "__Forneça um numero de 1/99 para deletar as mensagens__."
      );

    const fetched = await message.channel.messages.fetch({
      limit: deleteCount + 1,
    });
    message.channel.bulkDelete(fetched);
    message.channel
      .send(`🗑 ${args[0]} mensagens deletadas!`)
      .catch((error) =>
        console.log(`Não foi possível deletar mensagens devido a: ${error}`)
      );
  }
};
