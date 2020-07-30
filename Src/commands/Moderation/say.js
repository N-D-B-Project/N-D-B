const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class say extends BaseCommand {
  constructor() {
    super("diga", "dizer", []);
  }

  async run(client, message, args) {
    const sayMessage = args.join(" ");
    message.delete().catch((O_o) => {});
    message.channel.send(sayMessage);
  }
};
