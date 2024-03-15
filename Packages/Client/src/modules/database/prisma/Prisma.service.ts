import { AsyncLocalStorage } from "node:async_hooks";
import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AlsStore } from "../als/types";
import { Repositories } from "../types/constants";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	public constructor(@Inject(Repositories.ALS) private readonly als: AsyncLocalStorage<AlsStore>) {
		super();
	}
	private readonly logger = new Logger(PrismaService.name);

	async onModuleInit() {
		const state = this.als.getStore()["PrismaConnected"];
		if (!state) {
			await this.$connect();
			this.logger.log("PostgreSQL connected via Prisma");
			this.als.getStore()["PrismaConnected"] = true;
		}
	}
}
