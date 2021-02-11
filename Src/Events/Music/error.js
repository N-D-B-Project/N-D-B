const BaseEvent = require("../../Utils/Structures/BaseEvent");

const colors = require("colors");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
    seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

module.exports = class NodeErrorEvent extends BaseEvent {
  constructor() {
    super("ready");
  }

  async run(client, node, error) {
    //console.log(`Node error: ${error.message}`)
  }
};
