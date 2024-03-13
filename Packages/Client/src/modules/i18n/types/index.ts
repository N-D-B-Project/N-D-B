import { Context } from "@/modules/commands/Commands.context";
import { CommandInteraction, GuildChannel, Message, PartialMessage } from "discord.js";

export type TranslateInfo = Message | CommandInteraction | GuildChannel | PartialMessage | Context;
