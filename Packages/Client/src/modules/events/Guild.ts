import { Repositories } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { Context, ContextOf, On } from "necord";
import { GuildRepository } from "../database/repositories/Guild.repository";

@Injectable()
export class GuildEvents {
  public constructor(
    @Inject(Repositories.Guild) private readonly guildRepo: GuildRepository
  ) {}

  @On("guildCreate")
  public async onGuildCreate(@Context() [guild]: ContextOf<"guildCreate">) {
    await this.guildRepo.create(guild);
  }

  @On("guildDelete")
  public async onGuildDelete(@Context() [guild]: ContextOf<"guildDelete">) {
    await this.guildRepo.delete(guild);
  }

  @On("guildUpdate")
  public async onGuildUpdate(
    @Context() [oldGuild, newGuild]: ContextOf<"guildUpdate">
  ) {
    await this.guildRepo.update(oldGuild, newGuild);
  }
}
