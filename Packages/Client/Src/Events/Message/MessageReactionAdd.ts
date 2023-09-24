import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageReaction, User } from "discord.js";

export default class MessageReactionAddEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "messageReactionAdd",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, reaction: MessageReaction, user: User) {
    client.emit("ReactionRoleAdd", reaction, user);
  }
}
