import { Global, Module, type Provider } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APIUser, Guild, GuildReactionRoles, GuildSettings, User, UserSettings } from "@ndb/database";
import { ReactionRolesRepoProvider } from "@/modules/reactionRoles/types/providers";
import { Repositories } from "../types/constants";
import { GuildRepository } from "./Guild.repository";
import { UserRepository } from "./User.repository";

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
		TypeOrmModule.forFeature([Guild, GuildSettings, User, UserSettings, APIUser, GuildReactionRoles]),
	],
	providers: [...providers, ReactionRolesRepoProvider],
	exports: [TypeOrmModule, ...providers, ReactionRolesRepoProvider],
})
export class RepositoriesModule {}
