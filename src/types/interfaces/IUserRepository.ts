import type { DatabaseStatus } from "@/types";
import type { User } from "discord.js";
import type { UserEntity } from "../../modules/database/entities";

export interface IUserRepository {
	userSettings();
	get(userId: string): Promise<UserEntity>;
	getAll(): Promise<UserEntity[]>;
	create(
		user: User,
	): Promise<{ callback: UserEntity | undefined; status: DatabaseStatus }>;
	update(user: User): Promise<UserEntity>;
	delete(user: User): Promise<UserEntity>;
}
