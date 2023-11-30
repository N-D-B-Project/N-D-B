import { TranslateProvider } from "@/types/Providers";
import { Module } from "@nestjs/common";
import { DeveloperToolsMainSlashCommand } from "./Main.command";
import { TestCommand } from "./Test.command";

@Module({
  providers: [DeveloperToolsMainSlashCommand, TestCommand, TranslateProvider]
})
export class DeveloperToolsCommands {}
