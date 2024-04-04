import { CommandsService } from "@/modules/bot/commands/Commands.service";
import { SharedModule } from "@/modules/shared/shared.module";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("CommandsService", () => {
	let service: CommandsService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SharedModule],
			providers: [CommandsService],
		}).compile();

		service = module.get<CommandsService>(CommandsService);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
