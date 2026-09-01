import { Inject, Injectable } from "@nestjs/common";
import type { IReactionRolesRepository } from "#src/modules/reactionRoles/interfaces/IReactionRoleRepository.js";
import { ReactionRoles } from "#src/modules/reactionRoles/types/constants.js";
import type { ITicketsRepository } from "../tickets/interfaces/index.js";
import { Tickets } from "../tickets/types/constants.js";
import type { IDatabaseService } from "./interfaces/IDatabaseService.js";
import type {
	IGuildRepository,
	IUserRepository,
} from "./repositories/interfaces/index.js";
import { Repositories } from "./types/constants.js";

@Injectable()
export class DatabaseService implements IDatabaseService {
	public constructor(
		@Inject(Repositories.Guild) private readonly guild: IGuildRepository,
		@Inject(Repositories.User) private readonly user: IUserRepository,
		@Inject(ReactionRoles.Repository)
		private readonly reactionRoles: IReactionRolesRepository,
		@Inject(Tickets.Repository)
		private readonly ticketsRepo: ITicketsRepository,
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

	public TicketsRepo() {
		return this.ticketsRepo;
	}
}
