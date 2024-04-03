import { UserDTO } from "@/modules/api/user/user.dto";
import { UserEntity } from "../../entities";

export interface IAPIUserRepository {
	get(userId: string): Promise<UserEntity>;
	create(user: UserDTO): Promise<UserEntity>;
	update(user: UserDTO): Promise<UserEntity>;
}
