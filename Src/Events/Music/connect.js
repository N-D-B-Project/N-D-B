const BaseEvent = require("../../Utils/Structures/BaseEvent");

const colors = require("colors");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
    seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

module.exports = class NodeConnectEvent extends BaseEvent {
  constructor() {
    super("nodeConnect");
  }

  async run(client, node) {
    //console.log("Lavalink Node Conectado!")
    //console.log(date.format(new Date()).grey, "Music".cyan, " Lavalink  ", "Node Conectado!".magenta,"        INFO".yellow,"   Loaded".green)
  }
};
