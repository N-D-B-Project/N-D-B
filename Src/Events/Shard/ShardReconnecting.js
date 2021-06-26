const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

module.exports = class Event extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'shardReconnecting',
      once: false
    });
  }

  async run(client, shardId) {
    client.logger.debug(`Shard: #${shardId} está tentando se Reconectar!`);
  }
}