import { UserEntity } from "@/modules/shared/database/entities";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		user: UserEntity;
	}
}
