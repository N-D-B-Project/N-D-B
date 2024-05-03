import type { UserEntity } from "@/modules/database/entities";
import type { BaseMessageOptions, EmbedBuilder } from "discord.js";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		user: UserEntity;
	}
}

export type Content = string | EmbedBuilder | BaseMessageOptions;
