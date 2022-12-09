import { Channel, Message, Role, Emoji } from "discord.js";

export interface ReactionsType {
  message: Message["id"];
  channel: Channel["id"];
  role: Role["id"];
  emoji: Emoji["name"] | Emoji["identifier"];
  option: REACTION_OPTIONS;
}

enum REACTION_OPTIONS {
  1,
  2,
  3,
  4,
  5,
  6,
}

enum FetchType {
  All = "All",
  Channel = "Channel",
}
