import { Injectable, UseGuards } from "@nestjs/common";
import { Command } from "../../../common/decorators/Commands.decorator";
import { OwnerPermissionGuard } from "../../../common/guards/Permissions/Owner.Guard";
import { CommandContext } from "../Commands.context";

@UseGuards(OwnerPermissionGuard)
@Injectable()
export class TestCommand {
	@Command({
		legacy: {
			name: "test",
			description: "",
			usage: "",
		},
		permissions: {
			user: [],
			bot: [],
			guildOnly: false,
			ownerOnly: true,
		},
		category: "🛠️ Developer Tools",
		slash: {
			type: "Sub",
			deployMode: "Test",
			name: "test",
		},
	})
	public async onCommandRun([client, context]: CommandContext) {
		console.log("test");
	}
}
