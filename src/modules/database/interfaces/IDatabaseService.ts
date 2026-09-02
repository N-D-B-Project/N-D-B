import type { IReactionRolesRepository } from "#src/modules/reactionRoles/interfaces/index.js";
import type { IGuildRepository } from "../repositories/interfaces/IGuildRepository.js";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";

export interface IDatabaseService {
	GuildRepo(): IGuildRepository;
	UserRepo(): IUserRepository;
	ReactionRolesRepo(): IReactionRolesRepository;
}
