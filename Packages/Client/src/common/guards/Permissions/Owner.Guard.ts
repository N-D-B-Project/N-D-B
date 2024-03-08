import { CommandPermissions } from "@/common/decorators";
import { Config } from "@/types";
import { Extends, Services } from "@/types/Constants";
import { IDatabaseService, Ii18nService } from "@/types/Interfaces";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

export class OwnerPermissionGuard implements CanActivate {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		@Inject(Services.Database) private readonly database: IDatabaseService,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context } = Utils.context(executionContext);

		if (permissions.ownerOnly && !this.checkOwner(context.author.id)) {
			Utils.SendFunction(context, await this.Translate.TFunction(context, "Tools/Command:Checker:OwnerOnly"));
			return false;
		}

		return true;
	}

	private checkOwner(target: string) {
		return this.database.ConfigRepo().getOrThrow<Config["Discord"]>("Discord").Client.Owners.includes(target);
	}
}
