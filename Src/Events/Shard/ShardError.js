const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

module.exports = class ShardErrorEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'shardError',
      once: false
    });
  }

  async run(client, error, shardId) {
    client.logger.error(`Shard: #${shardId} Encontrou um erro: ${error}`);
  }
}