import { UserEntity } from "@/modules/SharedModule/database/entities";
import { BaseMessageOptions, EmbedBuilder } from "discord.js";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		user: UserEntity;
	}
}

export type Content = string | EmbedBuilder | BaseMessageOptions;
