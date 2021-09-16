import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class MessageDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "messageDelete"
    const options = {
      name: "messageDelete",
      type: "on"
    }

    super(client, name, options);
  }

  async run(client: NDBClient, message: any) {
    //# Check message type
    // if (message.author.bot || !message.guild) return;

    //! Snipe
    client.snipe.set(message.channel.id, {
      check: true,
      content: message.content,
      author: message.author,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })
  }
};
