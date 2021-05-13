const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");


module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client) {
    client.logger.ready(`${client.user.tag} Está Online!`)
    function setStatus() {
      const AStatus = client.Tools.Status[Math.floor(Math.random() * client.Tools.Status.length)];
      client.user.setPresence({ activity: AStatus });
    }
    setStatus();
    setInterval(() => setStatus(), 120000);
    
  }
}