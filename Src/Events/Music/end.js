const BaseEvent = require("../../Utils/Structures/BaseEvent");

const colors = require("colors");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
    seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

module.exports = class TrackStartEvent extends BaseEvent {
  constructor() {
    super("ready");
  }

  async run(client, player) {
      //player.textChannel.send("Queue has ended.");
      //client.music.players.destroy(player.guild.id);
  }
};
