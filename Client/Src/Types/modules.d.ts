import * as Discord from "discord.js";
declare module "discord.js" {
  interface BaseApplicationCommandData {
    ephemeral: boolean;
  }
}
