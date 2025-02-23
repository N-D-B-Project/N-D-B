import type { Guild, GuildSettings } from "@/__generated__/prisma";

export type GuildEntity = Guild & {
	Settings: GuildSettings;
};
