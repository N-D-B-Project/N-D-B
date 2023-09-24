import { GatewayVersion } from "discord-api-types/gateway";
export const DiscordAPIUrl = `https://discord.com/api/v${GatewayVersion}`;

export const isDebug = true;

export enum Services {
  AUTH = "AUTH_SERVICE",
  PRISMA = "PRISMA_SERVICE",
  USER = "USER_SERVICE",
  GUILDS = "GUILDS_SERVICE",
  DISCORD = "DISCORD_SERVICE",
  DISCORD_HTTP = "DISCORD_HTTP_SERVICE"
}

export enum Routes {
  AUTH = "auth",
  USER = "user",
  GUILDS = "guilds",
  DISCORD = "discord"
}

export enum Repositories {
  USER = "USER_REPOSITORY",
  GUILDS = "GUILDS_REPOSITORY"
}
