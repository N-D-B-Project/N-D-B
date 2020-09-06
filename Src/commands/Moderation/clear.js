const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class ClearCommand extends BaseCommand {
  constructor() {
    super("clear", "Moderation", []);
  }

  async run(client, message, args) {
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.reply("Lhe faltam permissões para isso");
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 1 || deleteCount > 100)
      return message.reply(
        "__Forneça um numero de 1/99 para deletar as mensagens__."
      );

    const fetched = await message.channel.messages.fetch({
      limit: deleteCount + 1,
    });
    message.channel.bulkDelete(fetched);
    message.delete().catch((O_o) => {});
    message.channel
      .send(`🗑 ${args[0]} mensagens deletadas!`)
      .catch((error) =>
        console.error(`Não foi possível deletar as mensagens devido a: ${error}`)
      );
  }
};
