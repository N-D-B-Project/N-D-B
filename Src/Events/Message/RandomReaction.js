const BaseEvent = require('../../Utils/Structures/BaseEvent');
const Discord = require("discord.js");

module.exports = class RandomReactionEvent extends BaseEvent {
  constructor() {
    super('message');
  }
  
  async run(client, message) {
    if(message.author.bot) return;
    const porcentagem = Math.floor(Math.random() * 26)

    if(porcentagem === 25) {
        const React = client.Tools.randomEmoji[Math.floor(Math.random() * client.Tools.randomEmoji.length)]
        message.react(React)
    }
  }
}