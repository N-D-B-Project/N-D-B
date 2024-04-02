import type { APIUser, User, UserSettings } from "@prisma/client";

export type UserEntity = User & {
	Settings: UserSettings;
	API?: APIUser;
};
