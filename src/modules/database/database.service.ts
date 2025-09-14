import type { IReactionRolesRepository } from "@/modules/reactionRoles/interfaces/IReactionRoleRepository";
import { ReactionRoles } from "@/modules/reactionRoles/types/constants";
import { Inject, Injectable } from "@nestjs/common";
import type { IDatabaseService } from "./interfaces/IDatabaseService";
import type {
	IGuildRepository,
	IUserRepository,
} from "./repositories/interfaces";
import { Repositories } from "./types/constants";

@Injectable()
export class DatabaseService implements IDatabaseService {
	public constructor(
		@Inject(Repositories.Guild) private readonly guild: IGuildRepository,
		@Inject(Repositories.User) private readonly user: IUserRepository,
		@Inject(ReactionRoles.Repository)
		private readonly reactionRoles: IReactionRolesRepository,
	) {}

	public GuildRepo(): IGuildRepository {
		return this.guild;
	}

	public UserRepo(): IUserRepository {
		return this.user;
	}

	public ReactionRolesRepo(): IReactionRolesRepository {
		return this.reactionRoles;
	}
}
