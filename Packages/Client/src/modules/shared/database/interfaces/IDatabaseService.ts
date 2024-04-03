import type { IReactionRolesRepository } from "@/modules/bot/reactionRoles/interfaces";
import type { IAsyncLocalStorage } from "../als/interfaces/IAsyncLocalStorage";
import { IAPIUserRepository } from "../repositories/interfaces/IAPIUserRepository";
import type { IGuildRepository } from "../repositories/interfaces/IGuildRepository";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";

export interface IDatabaseService {
	AlsRepo(): IAsyncLocalStorage;
	GuildRepo(): IGuildRepository;
	UserRepo(): IUserRepository;
	APIUserRepo(): IAPIUserRepository;
	ReactionRolesRepo(): IReactionRolesRepository;
}
