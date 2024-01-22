import { Guild, GuildReactionRoles, GuildSettings, User, UserSettings } from "@prisma/client";

export type GuildEntity = Guild & {
	Settings: GuildSettings;
};

export type UserEntity = User & {
	Settings: UserSettings;
};

export type ReactionRolesEntity = GuildReactionRoles;
