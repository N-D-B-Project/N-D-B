import "discord.js"

declare module "discord.js" {
  interface BaseApplicationCommandData {
    ephemeral: boolean
  }
}
