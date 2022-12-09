import { RESTJSONErrorCodes } from "discord-api-types/v10";

export const IGNORED_ERRORS = [
  RESTJSONErrorCodes.UnknownMessage,
  RESTJSONErrorCodes.UnknownChannel,
  RESTJSONErrorCodes.UnknownGuild,
  RESTJSONErrorCodes.UnknownUser,
  RESTJSONErrorCodes.UnknownInteraction,
  RESTJSONErrorCodes.CannotSendMessagesToThisUser, // User blocked bot or DM disabled
  RESTJSONErrorCodes.ReactionWasBlocked, // User blocked bot or DM disabled
  RESTJSONErrorCodes.MaximumActiveThreads,
];
