const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class TrackStartEvent extends BaseEvent {
  constructor() {
    super("ready");
  }

  async run(client, player) {
      //player.textChannel.send("Queue has ended.");
      //client.music.players.destroy(player.guild.id);
  }
};
