const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

module.exports = class DebugEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'debug',
      once: false
    });
  }

  async run(client, info ) {
    if(client.config.debug === true) client.logger.debug(info)
  }
}