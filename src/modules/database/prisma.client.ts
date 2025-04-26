import type { IReaction } from "@/types";
import { PrismaClient } from "@prisma/client";

export const extendedPrismaClient = new PrismaClient({
	log: ["info"],
	errorFormat: "pretty",
}).$extends({
	model: {
		guildReactionRoles: {
			checkIfExists: async (guildId: string, reaction: IReaction) => {
				return extendedPrismaClient.guildReactionRoles.findFirst({
					where: {
						guildId,
						channel: reaction.channel,
						message: reaction.message,
						role: reaction.role,
						emoji: reaction.emoji,
						option: reaction.option,
					},
				});
			},
		},
	},
});

export type ExtendedPrismaClient = typeof extendedPrismaClient;
