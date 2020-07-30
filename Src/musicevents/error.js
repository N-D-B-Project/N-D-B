const BaseEvent = require("../utils/structures/BaseEvent");

module.exports = class NodeErrorEvent extends BaseEvent {
  constructor() {
    super("nodeError");
  }

  async run(client, node, error) {
    console.log("Ocorreu um Erro");
    console.log(Error);
  }
};
