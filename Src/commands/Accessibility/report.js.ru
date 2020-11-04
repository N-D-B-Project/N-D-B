const BaseCommand = require("../../utils/structures/BaseCommand");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class report extends BaseCommand {
  constructor() {
    super(
      'report', //name
      'Accessibility', //category
      ['reportar'], //aliases
      '', //usage
      'reporta um usuário para a staff do server' //description
    );
  }

  async run(client, message, args) {
    message.delete();
    // mentioned or grabbed user
    let target =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!target)
      return message.channel
        .send("Please provide a valid user")
        .then((m) => m.delete(15000));

    // reasoning definition
    let reason = args.slice(1).join(" ");
    if (!reason)
      return message.channel
        .send(`Please provide a reason for reporting **${target.user.tag}**`)
        .then((m) => m.delete(15000));

    // grab reports channel
    let sChannel = message.guild.channels.find(
      (x) => x.name === "💢│reclamações"
    );

    // send to reports channel and add tick or cross

    message.channel
      .send("Your report has been filed to the staff team. Thank you!")
      .then((m) => m.delete(15000));
    sChannel
      .send(
        `**${message.author.tag}** has reported **${target.user.tag}** for **${reason}**.`
      )
      .then(async (msg) => {
        await msg.react("✅");
        await msg.react("❌");
      });
  }
};
