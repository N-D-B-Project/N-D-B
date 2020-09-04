const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class LockCommand extends BaseCommand {
  constructor() {
    super("lock", "ModTools", []);
  }

  async run(client, message, args) {
    if (args.split(" ").length !== 2)
      return message.channel.send("?lock <ROLE_ID> TRUE | FALSE | NULL");
    let [roleId, flag] = args.split(" ");
    if (!isNaN(roleId) && validateFlag(flag.toLowerCase())) {
      if (message.guild.roles.cache.has(roleId)) {
        flag =
          flag.toLowerCase() === "true"
            ? true
            : flag.toLowerCase() === "false"
            ? false
            : null;
        const channels = message.guild.channels.cache.filter(
          (ch) => ch.type !== "category"
        );
        channels.forEach((channel) => {
          if (!IGNORED.has(channel.id)) {
            channel
              .updateOverwrite(roleId, {
                SEND_MESSAGES: !flag,
              })
              .then((g) => {
                console.log(`Updated ${g.name} (${g.id})`);
                if (flag) {
                  if (!g.name.endsWith("🔒")) {
                    g.edit({ name: g.name + " 🔒" });
                  }
                } else {
                  g.edit({ name: g.name.replace(/\s*🔒/, "") });
                }
              })
              .catch((err) => console.log(err));
          } else {
            console.log(`Skipping ${channel.name} (${channel.id})`);
          }
        });
      } else {
        message.channel.send("Invalid Role.");
      }
    }
  }
};
