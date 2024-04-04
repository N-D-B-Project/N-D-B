import { AsyncLocalStorage } from "node:async_hooks";
import { ReactionRolesRepository } from "@/modules/bot/reactionRoles/ReactionRoles.repository";
import { AlsModule } from "@/modules/shared/database/als/als.module";
import { AlsStore } from "@/modules/shared/database/als/types";
import { DatabaseService } from "@/modules/shared/database/database.service";
import { PrismaModule } from "@/modules/shared/database/prisma/Prisma.module";
import { APIUserRepository } from "@/modules/shared/database/repositories/APIUser.repository";
import { GuildRepository } from "@/modules/shared/database/repositories/Guild.repository";
import { RepositoriesModule } from "@/modules/shared/database/repositories/Repositories.module";
import { UserRepository } from "@/modules/shared/database/repositories/User.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("DatabaseService", () => {
	let service: DatabaseService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [RepositoriesModule, PrismaModule, AlsModule],
			providers: [DatabaseService],
		}).compile();

		service = module.get<DatabaseService>(DatabaseService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});

	it("Should return ALS Repository", () => {
		expect(service.AlsRepo()).toBeInstanceOf(AsyncLocalStorage<AlsStore>);
	});

	it("Should return Guild Repository", () => {
		expect(service.GuildRepo()).toBeInstanceOf(GuildRepository);
	});

	it("Should return User Repository", () => {
		expect(service.UserRepo()).toBeInstanceOf(UserRepository);
	});

	it("Should return APIUser Repository", () => {
		expect(service.APIUserRepo()).toBeInstanceOf(APIUserRepository);
	});

	it("Should return ReactionRoles Repository", () => {
		expect(service.ReactionRolesRepo()).toBeInstanceOf(ReactionRolesRepository);
	});
});
