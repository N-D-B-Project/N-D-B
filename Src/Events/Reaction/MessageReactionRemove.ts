import NDBClient from "@Client/NDBClient";
import BaseEvent from "@Structures/BaseEvent";
import { EventOptions } from "~/Types";
import * as Discord from "discord.js";

export default class MessageReactionRemoveEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageReactionRemove",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(
    client: NDBClient,
    reaction: Discord.MessageReaction,
    user: Discord.User
  ) {
    if (user === client.user) return;
    client.emit("ReactionRoleRemove", reaction, user);
  }
}
