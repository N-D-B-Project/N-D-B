import type { IReactionRolesRepository } from "@/modules/bot/reactionRoles/interfaces/IReactionRoleRepository";
import { ReactionRoles } from "@/modules/bot/reactionRoles/types/constants";
import { Inject, Injectable } from "@nestjs/common";
import type { IAsyncLocalStorage } from "./als/interfaces/IAsyncLocalStorage";
import type { IDatabaseService } from "./interfaces/IDatabaseService";
import type { IGuildRepository, IUserRepository } from "./repositories/interfaces";
import type { IAPIUserRepository } from "./repositories/interfaces/IAPIUserRepository";
import { Repositories } from "./types/constants";

@Injectable()
export class DatabaseService implements IDatabaseService {
	public constructor(
		@Inject(Repositories.ALS) private readonly als: IAsyncLocalStorage,
		@Inject(Repositories.Guild) private readonly guild: IGuildRepository,
		@Inject(Repositories.User) private readonly user: IUserRepository,
		@Inject(Repositories.APIUser) private readonly apiUser: IAPIUserRepository,
		@Inject(ReactionRoles.Repository) private readonly reactionRoles: IReactionRolesRepository,
	) {}

	public AlsRepo(): IAsyncLocalStorage {
		return this.als;
	}

	public GuildRepo(): IGuildRepository {
		return this.guild;
	}

	public UserRepo(): IUserRepository {
		return this.user;
	}

	public APIUserRepo(): IAPIUserRepository {
		return this.apiUser;
	}

	public ReactionRolesRepo(): IReactionRolesRepository {
		return this.reactionRoles;
	}
}
