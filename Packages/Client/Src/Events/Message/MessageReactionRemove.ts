import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageReaction, User } from "discord.js";

export default class MessageReactionRemoveEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "messageReactionRemove",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, reaction: MessageReaction, user: User) {
    client.emit("ReactionRoleRemove", reaction, user);
  }
}
