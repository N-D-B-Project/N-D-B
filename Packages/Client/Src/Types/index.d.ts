import { Collections } from "@/Config/ClientUtils";
import MusicManager from "@/Core/MusicManager";
import PrismaProvider from "@/Database/Prisma.provider";
import { Translate } from "@/Utils/Handlers";
import { Tools } from "@/Utils/Tools";
import { Client } from "discord.js";

export {
  CommandOptions,
  EventOptions,
  SlashCommandOptions,
  SubCommandOptions,
  SwitchCommand,
  eCommandType
} from "./client";
export { JobDaily, Jobs, WorkedBonus } from "./ndcash";

export interface INDBClient extends Client {
  database: PrismaProvider;
  Collections: Collections;
  Tools: Tools;
  Translate: Translate;
  MusicManager: MusicManager;
  logger: Logger;

  Start(): Promise<void>;
}
