const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.js");

module.exports = class PruneCommand extends BaseCommand {
  constructor() {
    super("prune", "ModTools", []);
  }

  async run(client, message, args) {
    let [userId, limit] = args.split(/\s+/);
    if (!userId && !limit) {
      let deletedMessages = await msg.channel.bulkDelete();
      msg.channel.send(`${deletedMessages.size} messages were deleted.`);
    }
    if (!userId || !limit)
      return msg.channel.send("Please provide the correct arguments.");
    let r = new RegExp(/^\d+$/);
    if (!r.test(userId))
      return msg.channel.send("Please provide a valid user id.");
    if (isNaN(limit))
      return msg.channel.send("Please provide a numeric value for limit");
    if (limit > 100)
      return msg.channel.send("Limit must be less than or equal to 100.");
    try {
      let fetchedMessages = await msg.channel.messages.fetch({ limit });
      let filteredMessages = fetchedMessages.filter(
        (msg) => msg.author.id === userId
      );
      let deletedMessages = await msg.channel.bulkDelete(filteredMessages);
      msg.channel.send(`${deletedMessages.size} messages were deleted.`);
    } catch (err) {
      console.log(err);
    }
  }
};
