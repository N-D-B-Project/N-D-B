import type { User, UserSettings } from "@prisma/client";

export type UserEntity = User & {
	Settings: UserSettings;
};
