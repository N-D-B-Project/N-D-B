import ReactionRoleRepository from "@/Modules/ReactionRole/Utils/ReactionRole.repository";
import { INDBClient } from "@/Types";
import { PrismaClient } from "@prisma/client";
import {
  GuildRepository,
  NDCashRepository,
  UserRepository
} from "./Repositories";

export default class PrismaProvider extends PrismaClient {
  private isConnected: boolean = false;
  public GuildRepo = new GuildRepository(this);
  public UserRepo = new UserRepository(this);
  public NDCashRepo = new NDCashRepository(this);
  public ReactionRoleRepo = new ReactionRoleRepository(this);
  constructor(private readonly client: INDBClient) {
    super();
  }

  isDatabaseConnected() {
    return this.isConnected;
  }

  setStatus(Connection: boolean) {
    this.isConnected = Connection;
  }

  async Connect(): Promise<void> {
    try {
      await this.$connect();
      this.setStatus(true);
      this.client.logger.database("PostgreSQL connected via Prisma");
    } catch (error) {
      this.client.logger.error(String(error));
    }
  }

  async Disconnect(reason: string): Promise<void> {
    try {
      await this.$disconnect();
      this.setStatus(false);
      this.client.logger.database(
        `PostgreSQL disconnected via Prisma, Reason: ${reason}`
      );
    } catch (error) {
      this.client.logger.error(String(error));
    }
  }
}
