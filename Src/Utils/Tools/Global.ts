import * as DiscordAPI from "discord-api-types/v9";

export const IGNORED_ERRORS = [
  DiscordAPI.RESTJSONErrorCodes.UnknownMessage,
  DiscordAPI.RESTJSONErrorCodes.UnknownChannel,
  DiscordAPI.RESTJSONErrorCodes.UnknownGuild,
  DiscordAPI.RESTJSONErrorCodes.UnknownUser,
  DiscordAPI.RESTJSONErrorCodes.UnknownInteraction,
  DiscordAPI.RESTJSONErrorCodes.CannotSendMessagesToThisUser, // User blocked bot or DM disabled
  DiscordAPI.RESTJSONErrorCodes.ReactionWasBlocked, // User blocked bot or DM disabled
];
