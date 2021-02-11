const BaseEvent = require('../../Utils/Structures/BaseEvent');
const Discord = require("discord.js");

module.exports = class RandomReactionEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {
    const porcentagem = Math.floor(Math.random() * 51)

    if(porcentagem === 50) {
        const React = client.Tools.randomEmoji[Math.floor(Math.random() * client.Tools.randomEmoji.length)]
        message.react(React)
    }
  }
}