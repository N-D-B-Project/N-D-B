import type { APIUser, User, UserSettings } from "@/__generated__/prisma";

export type UserEntity = User & {
	Settings: UserSettings;
	APIUser?: APIUser;
};
