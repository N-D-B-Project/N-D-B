import { UserEntity } from "@/modules/shared/database/entities";

export interface JwtPayload {
	id: UserEntity["API"]["userId"];
}
