import { GatewayVersion } from "discord-api-types/gateway";
export const DiscordAPIUrl = `https://discord.com/api/v${GatewayVersion}`;

export const isInProduction = false;

export enum Services {
	NDB = "NDB_SERVICE",
	Prisma = "PRISMA_SERVICE",
	Database = "DATABASE_SERVICE",
	User = "USER_SERVICE",
	Auth = "AUTH_SERVICE",
	Discord = "DISCORD_SERVICE",
	Discord_HTTP = "DISCORD_HTTP_SERVICE",
}

export enum Routes {
	Auth = "auth",
	Discord = "discord",
}

export enum Extends {
	Tools = "TOOLS",
	Command = "COMMAND",
	Buttons = "COMPONENTS_BUTTONS",
}

export enum Cookies {
	JWT = "N-D-B_JWT_SESSION",
}
