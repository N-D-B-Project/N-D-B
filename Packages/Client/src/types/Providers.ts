import { CommandsService } from "@/modules/commands/Commands.service";
import { DatabaseService } from "@/modules/database/database.service";
import { PrismaService } from "@/modules/database/prisma/Prisma.service";
import { GuildRepository } from "@/modules/database/repositories/Guild.repository";
import { UserRepository } from "@/modules/database/repositories/User.repository";
import { I18nService } from "@/modules/i18n/i18n.service";
import { AsyncLocalStorage } from "async_hooks";
import { AlsStore } from ".";
import { Extends, Repositories, Services } from "./Constants";

export const PrismaProvider = {
	provide: Services.Prisma,
	useClass: PrismaService,
};

export const AlsProvider = {
	provide: Repositories.ALS,
	useValue: new AsyncLocalStorage<AlsStore>(),
};

export const GuildRepoProvider = {
	provide: Repositories.Guild,
	useClass: GuildRepository,
};

export const UserRepoProvider = {
	provide: Repositories.User,
	useClass: UserRepository,
};

export const DatabaseProvider = {
	provide: Services.Database,
	useClass: DatabaseService,
};

export const TranslateProvider = {
	provide: Extends.Translate,
	useClass: I18nService,
};

export const CommandProvider = {
	provide: Extends.Command,
	useClass: CommandsService,
};
