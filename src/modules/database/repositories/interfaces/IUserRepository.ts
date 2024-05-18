import type { User } from "discord.js";
import type { UserEntity } from "../../entities";
import type { DatabaseStatus } from "../../types";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export interface IUserRepository {
  userSettings(): Prisma.UserSettingsDelegate<DefaultArgs>
	get(userId: string): Promise<UserEntity>;
	getAll(): Promise<UserEntity[]>;
	create(user: User): Promise<{ callback: UserEntity | void; status: DatabaseStatus }>;
	update(user: User): Promise<UserEntity>;
	delete(user: User): Promise<UserEntity>;
}
