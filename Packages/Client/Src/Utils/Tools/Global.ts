import { RESTJSONErrorCodes } from "discord-api-types/v10"
import {
  BaseMessageOptions,
  DiscordAPIError,
  EmbedBuilder,
  MessageEditOptions
} from "discord.js"

export const IGNORED_ERRORS = [
  RESTJSONErrorCodes.UnknownMessage,
  RESTJSONErrorCodes.UnknownChannel,
  RESTJSONErrorCodes.UnknownGuild,
  RESTJSONErrorCodes.UnknownUser,
  RESTJSONErrorCodes.UnknownInteraction,
  RESTJSONErrorCodes.CannotSendMessagesToThisUser, // User blocked bot or DM disabled
  RESTJSONErrorCodes.ReactionWasBlocked, // User blocked bot or DM disabled
  RESTJSONErrorCodes.MaximumActiveThreads
]

export async function CheckError(error): Promise<boolean> {
  return (
    error instanceof DiscordAPIError &&
    typeof error.code == "number" &&
    IGNORED_ERRORS.includes(error.code as number)
  )
}

export function messageOptions(
  content: string | EmbedBuilder | BaseMessageOptions
): BaseMessageOptions {
  var options: BaseMessageOptions | MessageEditOptions =
    typeof content === "string"
      ? { content }
      : content instanceof EmbedBuilder
      ? { embeds: [content] }
      : content

  return options
}
