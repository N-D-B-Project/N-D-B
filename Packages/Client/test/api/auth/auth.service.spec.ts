import { AuthService } from "@/modules/api/auth/auth.service";
import { UserModule } from "@/modules/api/user/user.module";
import { SharedModule } from "@/modules/shared/shared.module";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("AuthService", () => {
	let service: AuthService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [UserModule, SharedModule],
			providers: [AuthService],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
