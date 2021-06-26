const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

module.exports = class ShardReadyEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'shardReady',
      once: false
    });
  }

  async run(client, shardId, unavaliableGuilds) {
    client.logger.ready(`Shard: #${shardId} está online com: ${(unavaliableGuilds || new Set()).size} servidores indisponíveis`)
  }
}