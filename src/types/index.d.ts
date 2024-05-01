import { UserEntity } from "@/modules/shared/database/entities";
import { BaseMessageOptions, EmbedBuilder } from "discord.js";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		user: UserEntity;
	}
}

export type Content = string | EmbedBuilder | BaseMessageOptions;
