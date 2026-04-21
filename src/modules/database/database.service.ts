import { Inject, Injectable } from "@nestjs/common";
import type { IReactionRolesRepository } from "@/modules/reactionRoles/interfaces/IReactionRoleRepository";
import { ReactionRoles } from "@/modules/reactionRoles/types/constants";
import type { ITicketsRepository } from "../tickets/interfaces";
import { Tickets } from "../tickets/types/constants";
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
