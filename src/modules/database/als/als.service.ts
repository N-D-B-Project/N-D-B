import { AsyncLocalStorage } from "node:async_hooks";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Repositories } from "../types/constants";
import { AlsStore } from "./types";

@Injectable()
export class AlsService implements OnModuleInit {
	public constructor(@Inject(Repositories.ALS) private readonly als: AsyncLocalStorage<AlsStore>) {}

	public async onModuleInit() {
		this.als.enterWith({
			PrismaConnected: false,
		});
	}
}
