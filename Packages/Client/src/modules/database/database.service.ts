import { Config } from "@/types";
import { Repositories } from "@/types/Constants";
import { IAsyncLocalStorage, IDatabaseService, IGuildRepository, IUserRepository } from "@/types/Interfaces";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseService implements IDatabaseService {
	public constructor(
		@Inject(Repositories.ALS) private readonly als: IAsyncLocalStorage,
		@Inject(Repositories.Guild) private readonly guild: IGuildRepository,
		@Inject(Repositories.User) private readonly user: IUserRepository,
		private readonly config: ConfigService<Config>,
	) {}

	public AlsRepo(): IAsyncLocalStorage {
		return this.als;
	}

	public ConfigRepo(): ConfigService<Config> {
		return this.config;
	}

	public GuildRepo(): IGuildRepository {
		return this.guild;
	}

	public UserRepo(): IUserRepository {
		return this.user;
	}
}
