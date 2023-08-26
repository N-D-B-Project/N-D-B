import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Message, TextChannel } from "discord.js";

export default class NotQuiteNitroEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "NotQuiteNitro",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, message: Message, emojis: RegExpMatchArray) {
    let replyContent = message.content;
    emojis.forEach(async _emoji => {
      const emoji = client.emojis.cache.find(e => e.name === _emoji);
      if (!emoji) return;
      if (new RegExp(emoji.toString(), "g").test(replyContent)) {
        replyContent = message.content.replace(
          new RegExp(emoji.toString(), "g"),
          emoji.toString()
        );
      } else {
        replyContent = message.content.replace(
          new RegExp(":" + _emoji + ":", "g"),
          emoji.toString()
        );
      }

      const webhook = (
        await (message.channel as TextChannel).fetchWebhooks()
      ).find(w => w.name === "N-D-B_NQN");
      if (!webhook) {
        await (message.channel as TextChannel).createWebhook({
          reason: await client.Translate.Guild(
            "Events/MessageCreate:NQNCreationReason",
            message,
            { Username: message.author.username, UserId: message.author.id }
          ),
          name: "N-D-B_NQN",
          avatar: client.user.displayAvatarURL()
        });
      }
      await webhook.edit({
        name: message.member.nickname
          ? message.member.nickname
          : message.author.username,
        avatar: message.author.displayAvatarURL()
      });

      message.delete();
      webhook.send(replyContent);

      await webhook.edit({
        name: "N-D-B_NQN",
        avatar: client.user.displayAvatarURL()
      });
    });
  }
}
