export const isInProduction = false;

export enum Services {
	NDB = "NDB_SERVICE",
	Prisma = "PRISMA_SERVICE",
	Database = "DATABASE_SERVICE",
	Config = "CONFIG_SERVICE",
	ReactionRoles = "REACTION_ROLES_SERVICE",
}

export enum Extends {
	Tools = "TOOLS",
	Command = "COMMAND",
	Buttons = "COMPONENTS_BUTTONS",
}

export enum Repositories {
	Guild = "GUILD_REPOSITORY",
	User = "USER_REPOSITORY",
	ALS = "ALS_REPOSITORY",
	ReactionRoles = "REACTION_ROLES_REPOSITORY",
}

export enum Embeds {
	Music = "MUSIC_EMBEDS",
	ReactionRoles = "REACTION_ROLES_EMBEDS",
}

export enum PlayerProps {
	message = "MESSAGE",
	trackMessage = "TRACK_MESSAGE",
}
