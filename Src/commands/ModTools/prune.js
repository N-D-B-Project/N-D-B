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
      let deletedMessages = await message.channel.bulkDelete();
      message.channel.send(`${deletedMessages.size} messages were deleted.`);
    }
    if (!userId || !limit)
      return message.channel.send("Please provide the correct arguments.");
    let r = new RegExp(/^\d+$/);
    if (!r.test(userId))
      return message.channel.send("Please provide a valid user id.");
    if (isNaN(limit))
      return message.channel.send("Please provide a numeric value for limit");
    if (limit > 100)
      return message.channel.send("Limit must be less than or equal to 100.");
    try {
      let fetchedMessages = await message.channel.messages.fetch({ limit });
      let filteredMessages = fetchedMessages.filter(
        (message) => message.author.id === userId
      );
      let deletedMessages = await message.channel.bulkDelete(filteredMessages);
      message.channel.send(`${deletedMessages.size} messages were deleted.`);
    } catch (err) {
      console.log(err);
    }
  }
};
