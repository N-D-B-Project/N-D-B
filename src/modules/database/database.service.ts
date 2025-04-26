import {
	type IDatabaseService,
	type IGuildRepository,
	type IReactionRolesRepository,
	type IUserRepository,
	Repositories,
} from "@/types";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DatabaseService implements IDatabaseService {
	public constructor(
		@Inject(Repositories.Guild) private readonly guild: IGuildRepository,
		@Inject(Repositories.User) private readonly user: IUserRepository,
		@Inject(Repositories.ReactionRoles)
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
