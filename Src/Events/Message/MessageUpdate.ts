import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class MessageUpdateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "messageUpdate"
    const options = {
      name: "messageUpdate",
      type: "on",
      manyArgs: 2
    }

    super(client, name, options);
  }

  async run(client: NDBClient, oldMessage: any, newMessage: any) {
    //# Check message type
    if (newMessage.author.bot || !newMessage.guild) return;

    //! EditSnipe
    client.editSnipe.set(newMessage.channel.id, {
      check: true,
      OldContent: oldMessage.content,
      NewContent: newMessage.content,
      author: newMessage.author,
      image: newMessage.attachments.first() ? newMessage.attachments.first().proxyURL : null
    })
  }
};
