/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */

import { Channel, Emoji, Message, Role, TextChannel } from "discord.js";

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
  6
}

enum FetchType {
  All = "All",
  Channel = "Channel"
}

export interface iReactionArray {
  message: string;
  channel: string;
  role: string;
  emoji: string;
  option: number;
}

export interface iReaction {
  Channel: TextChannel["id"];
  Message: Message["id"];
  Role: Role["id"];
  Emoji: Emoji["id"] | Emoji["identifier"];
  Option?: REACTION_OPTIONS;
}
