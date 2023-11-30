import { AlsStore } from "@/types";
import { Repositories } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { GuildRepository } from "./repositories/Guild.repository";

@Injectable()
export class DatabaseService {
  public constructor(
    @Inject(Repositories.ALS) private readonly als: AsyncLocalStorage<AlsStore>,
    @Inject(Repositories.Guild) private readonly guild: GuildRepository
  ) {}

  public onModuleInit() {}

  public GuildRepo() {
    return this.guild;
  }

  public AlsRepo() {
    return this.als;
  }
}
