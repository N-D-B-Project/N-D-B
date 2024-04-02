import { UserEntity } from "@/modules/database/entities";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		user: UserEntity;
	}
}
