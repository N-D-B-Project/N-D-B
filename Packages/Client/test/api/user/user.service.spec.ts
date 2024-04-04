import { UserService } from "@/modules/api/user/user.service";
import { SharedModule } from "@/modules/shared/shared.module";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("UserService", () => {
	let service: UserService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SharedModule],
			providers: [UserService],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
