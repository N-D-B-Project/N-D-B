import type { IGuildRepository } from "./IGuildRepository";
import type { IReactionRolesRepository } from "./IReactionRoleRepository";
import type { IUserRepository } from "./IUserRepository";

export interface IDatabaseService {
	GuildRepo(): IGuildRepository;
	UserRepo(): IUserRepository;
	ReactionRolesRepo(): IReactionRolesRepository;
}
