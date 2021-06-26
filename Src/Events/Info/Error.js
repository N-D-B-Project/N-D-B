const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

module.exports = class ErrorEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'error',
      once: false
    });
  }

  async run(client, err) {
    client.log.error("Client encontrou um erro: " + err)
  }
}