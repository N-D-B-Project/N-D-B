const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

module.exports = class WarnEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'warn',
      once: false
    });
  }

  async run(client, info) {
    client.logger.log(info)
  }
}