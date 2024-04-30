import type { IReactionRolesRepository } from "@/modules/reactionRoles/interfaces";
import type { IAsyncLocalStorage } from "../als/interfaces/IAsyncLocalStorage";
import type { IAPIUserRepository } from "../repositories/interfaces/IAPIUserRepository";
import type { IGuildRepository } from "../repositories/interfaces/IGuildRepository";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";

export interface IDatabaseService {
	AlsRepo(): IAsyncLocalStorage;
	GuildRepo(): IGuildRepository;
	UserRepo(): IUserRepository;
	APIUserRepo(): IAPIUserRepository;
	ReactionRolesRepo(): IReactionRolesRepository;
}
