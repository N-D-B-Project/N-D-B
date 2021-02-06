// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
const BaseEvent = require('../../Utils/Structures/BaseEvent');
const Discord = require("discord.js");
module.exports = class MessageUpdateEvent extends BaseEvent {
  constructor() {
    super('messageUpdate');
  }
  
  async run(client, message, oldMessage, newMessage) {
    client.editSnipe.set(message.channel.id, {
      OldContent:oldMessage,
      NewContent:newMessage,
      author:message.author,
      image:message.attachments.first() ? message.attachments.first().proxyURL : null
    })
  }
}