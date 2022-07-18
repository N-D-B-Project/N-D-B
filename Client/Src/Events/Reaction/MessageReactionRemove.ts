import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { EventOptions } from "~/Types";
import { MessageReaction, User } from "discord.js";

export default class MessageReactionRemoveEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageReactionRemove",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, reaction: MessageReaction, user: User) {
    if (user === client.user) return;
    client.emit("ReactionRoleRemove", reaction, user);
  }
}
