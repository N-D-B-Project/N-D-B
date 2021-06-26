const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

module.exports = class ShardDisconnectEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'shardDisconnect',
      once: false
    });
  }

  async run(client, event, shardId) {
    client.logger.error(`Shard: #${shardId} Desconectado com o erro: ${event.reason}`)
  }
}