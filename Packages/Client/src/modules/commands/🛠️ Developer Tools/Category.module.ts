import { DatabaseProvider, TranslateProvider } from "@/types/Providers";
import { Module } from "@nestjs/common";
import { EvalCommand } from "./Eval.command";
import { DeveloperToolsMainSlashCommand } from "./Main.command";
import { TestCommand } from "./Test.command";

@Module({
  providers: [
    DeveloperToolsMainSlashCommand,
    TestCommand,
    EvalCommand,
    TranslateProvider,
    DatabaseProvider
  ]
})
export class DeveloperToolsCommands {}
