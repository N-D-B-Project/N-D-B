import { UserEntity } from "@/modules/shared/database/entities";
import { UserDTO } from "../../user/user.dto";
import { JwtPayload } from "../types";

export interface IAuthService {
	validateUser(details: UserDTO): Promise<UserEntity>;
	get(payload: JwtPayload): Promise<UserEntity>;
	login(payload: JwtPayload): Promise<string>;
}
