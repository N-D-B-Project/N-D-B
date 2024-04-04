import { AlsModule } from "@/modules/shared/database/als/als.module";
import { DatabaseService } from "@/modules/shared/database/database.service";
import { PrismaModule } from "@/modules/shared/database/prisma/Prisma.module";
import { RepositoriesModule } from "@/modules/shared/database/repositories/Repositories.module";
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
});
