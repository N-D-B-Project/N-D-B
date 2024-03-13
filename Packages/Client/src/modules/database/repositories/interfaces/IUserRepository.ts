import type { User } from "discord.js";
import type { UserEntity } from "../../entities";
import type { DatabaseStatus } from "../../types";

export interface IUserRepository {
	get(userId: string): Promise<UserEntity>;
	create(user: User): Promise<{ callback: UserEntity | void; status: DatabaseStatus }>;
	update(oldUser: User, newUser: User): Promise<UserEntity>;
	delete(user: User): Promise<UserEntity>;
}
