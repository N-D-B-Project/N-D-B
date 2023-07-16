import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageReaction, User } from "discord.js";

export default class MessageReactionRemoveEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageReactionRemove",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, reaction: MessageReaction, user: User) {
    client.emit("ReactionRoleRemove", reaction, user);
  }
}
