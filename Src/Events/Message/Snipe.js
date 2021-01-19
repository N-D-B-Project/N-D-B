const BaseEvent = require('../../utils/structures/BaseEvent');
const Discord = require("discord.js");

module.exports = class MessageDeleteEvent extends BaseEvent {
  constructor() {
    super('messageDelete');
  }
  
  async run(client, message) {
    client.snipe.set(message.channel.id, {
        content:message.content,
        author:message.author,
        image:message.attachments.first() ? message.attachments.first().proxyURL : null
      })
  }
}