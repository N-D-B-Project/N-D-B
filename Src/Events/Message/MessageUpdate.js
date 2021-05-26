const BaseEvent = require('../../Utils/Structures/BaseEvent');
const Discord = require("discord.js");

module.exports = class MessageUpdateEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
        name: "messageUpdate"
    });
  }
  
  async run(client, message, oldMessage, newMessage) {
    //# Check message author/type
    if(message.author.bot) return;
    if(message.channel.type === "DM") return;
    
    //! EditSnipe
    client.editSnipe.set(message.channel.id, {
      OldContent:oldMessage,
      NewContent:newMessage,
      author:message.author,
      image:message.attachments.first() ? message.attachments.first().proxyURL : null
    })
  }
}