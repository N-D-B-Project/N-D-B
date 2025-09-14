import type { IReactionRolesRepository } from "@/modules/reactionRoles/interfaces";
import type { IGuildRepository } from "../repositories/interfaces/IGuildRepository";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";

export interface IDatabaseService {
	GuildRepo(): IGuildRepository;
	UserRepo(): IUserRepository;
	ReactionRolesRepo(): IReactionRolesRepository;
}
