import { Buttons } from "@/modules/bot/components/Buttons.component";
import { I18nModule } from "@/modules/bot/i18n/i18n.module";
import { SharedModule } from "@/modules/shared/shared.module";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";

describe("Buttons", () => {
	let service: Buttons;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [I18nModule, SharedModule],
			providers: [Buttons],
		}).compile();

		service = module.get<Buttons>(Buttons);
	});

	it("Should be Defined", () => {
		expect(service).toBeDefined();
	});
});
