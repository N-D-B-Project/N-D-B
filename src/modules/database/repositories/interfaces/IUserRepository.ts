import type { User } from "discord.js";
import type { UserEntity } from "../../entities";
import type { DatabaseStatus } from "../../types";

export interface IUserRepository {
	userSettings();
	get(userId: string): Promise<UserEntity>;
	getAll(): Promise<UserEntity[]>;
	create(
		user: User,
		// biome-ignore lint/suspicious/noConfusingVoidType: <Prisma returns void if no data is returned>
	): Promise<{ callback: UserEntity | void; status: DatabaseStatus }>;
	update(user: User): Promise<UserEntity>;
	delete(user: User): Promise<UserEntity>;
}
