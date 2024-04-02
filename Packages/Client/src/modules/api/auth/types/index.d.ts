import { UserEntity } from "@/modules/database/entities";

export interface JwtPayload {
	id: UserEntity["API"]["userId"];
}
