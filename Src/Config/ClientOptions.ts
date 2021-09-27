import * as Discord from "discord.js";

export const ClientConfig: Discord.ClientOptions = {
  messageCacheLifetime: 10000,
  restTimeOffset: 0,
  shards: "auto",
  restWsBridgeTimeout: 100,
  allowedMentions: { parse: ["users", "roles"] },
  partials: [
    "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"
  ],
  intents: /* 32767 */[
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
  makeCache: Discord.Options.cacheWithLimits({
    ...Discord.Options.defaultMakeCacheSettings,
    MessageManager: {
      maxSize: 2,
      sweepInterval: 60 * 60,
    },
    ThreadManager: {
      maxSize: 2,
      sweepInterval: 60 * 60,
    },
    ThreadMemberManager: {
      maxSize: 2,
      sweepInterval: 60 * 60,
    },
  }),
};
