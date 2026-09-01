import {
	APIUser,
	Guild,
	GuildReactionRoles,
	GuildSettings,
	User,
	UserSettings,
} from "@ndb/database";
import { Global, Module, type Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReactionRolesRepoProvider } from "#src/modules/reactionRoles/types/providers.js";
import { Repositories } from "../types/constants.js";
import { GuildRepository } from "./Guild.repository.js";
import { UserRepository } from "./User.repository.js";

const providers: Provider<GuildRepository | UserRepository>[] = [
	{
		provide: Repositories.Guild,
		useClass: GuildRepository,
	},
	{
		provide: Repositories.User,
		useClass: UserRepository,
	},
];

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			Guild,
			GuildSettings,
			User,
			UserSettings,
			APIUser,
			GuildReactionRoles,
		]),
	],
	providers: [...providers, ReactionRolesRepoProvider],
	exports: [TypeOrmModule, ...providers, ReactionRolesRepoProvider],
})
export class RepositoriesModule {}
