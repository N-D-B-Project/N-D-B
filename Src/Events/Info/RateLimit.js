const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

module.exports = class Event extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'rateLimit',
      once: false
    });
  }

  async run(client, { route, timeout}) {
    if(client.config.debug === true) client.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);
 }
}