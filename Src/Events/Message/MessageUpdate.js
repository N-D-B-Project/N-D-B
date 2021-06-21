const BaseEvent = require('../../Utils/Structures/BaseEvent');
const Discord = require("discord.js");

module.exports = class MessageUpdateEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
        name: "messageUpdate"
    });
  }
  
  async run(client, oldMessage, newMessage) {
    //# Check message author/type
    try {
      if(newMessage.author.bot) return;
      if(newMessage.channel.type === "DM") return;
    } catch {}

    //! EditSnipe
    client.editSnipe.set(newMessage.channel.id, {
      check:true,
      OldContent:oldMessage.content,
      NewContent:newMessage.content,
      author:newMessage.author,
      image:newMessage.attachments.first() ? newMessage.attachments.first().proxyURL : null
    })
  }
}