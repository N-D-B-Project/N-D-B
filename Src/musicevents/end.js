const BaseEvent = require("../utils/structures/BaseEvent");

module.exports = class TrackStartEvent extends BaseEvent {
  constructor() {
    super("queueEnd");
  }

  async run(client, player) {
    player.textChannel.send("Queue Terminada");
    client.music.players.destroy(player.guild.id);
  }
};
