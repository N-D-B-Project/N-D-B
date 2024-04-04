import { AlsProvider } from "@/modules/shared/database/als/als.module";
import { PrismaService } from "@/modules/shared/database/prisma/Prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("PrismaService", () => {
	let service: PrismaService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PrismaService, AlsProvider],
		}).compile();

		service = module.get<PrismaService>(PrismaService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
