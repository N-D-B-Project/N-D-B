import type { Guild, GuildSettings } from "@prisma/client";

export type GuildEntity = Guild & {
	Settings: GuildSettings;
};
