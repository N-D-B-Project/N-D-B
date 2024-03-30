import { Context } from "@/modules/bot/commands/Commands.context";
import { User } from "discord.js";
import { TranslateInfo } from "../types";

export interface Ii18nService {
	Logger(): void;
	Guild(info: TranslateInfo, key: string, args?: Record<string, unknown>): Promise<string>;
	DM(key: string, user: User, args?: Record<string, unknown>): Promise<string>;
	TFunction(context: Context, key: string, args?: Record<string, unknown>): Promise<string>;
}
