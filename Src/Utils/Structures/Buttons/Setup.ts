import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";

export default class SetupButtons {
  client: NDBClient;

  constructor(client) {
    this.client = client;
  }

  async AllButtons(message) {
    return new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("Info")
        .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:Info", message))
        .setStyle("PRIMARY")
        .setEmoji("ℹ️"),
      new Discord.MessageButton()
        .setCustomId("Geral")
        .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:Geral", message))
        .setStyle("PRIMARY")
        .setEmoji("⚙️"),
      new Discord.MessageButton()
        .setCustomId("Roles")
        .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:Roles", message))
        .setStyle("PRIMARY")
        .setEmoji("🔑"),
      new Discord.MessageButton()
        .setCustomId("Channels")
        .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:Channels", message))
        .setStyle("PRIMARY")
        .setEmoji("📖"),
      new Discord.MessageButton()
        .setCustomId("Systens")
        .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:Systens", message))
        .setStyle("PRIMARY")
        .setEmoji("💾")
    );
  }

  async HomeButton(message) {
    return new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("Menu")
        .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:Menu", message))
        .setStyle("PRIMARY")
        .setEmoji("🏠")
    );
  }

  async GeralButtons(message) {
    return new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId("Prefix")
          .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:Prefix", message))
          .setStyle("PRIMARY")
          .setEmoji("🔘"),
        new Discord.MessageButton()
          .setCustomId("Language")
          .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:Language", message))
          .setStyle("PRIMARY")
          .setEmoji("🌎"),
      )
  }

  async RolesButtons(message: any) {
    return new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("DefaultRole")
        .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:RolesButtons:Default", message))
        .setStyle("PRIMARY")
        .setEmoji("📦")
      ),
      new Discord.MessageButton()
        .setCustomId("MutedRole")
        .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:RolesButtons:Muted", message))
        .setStyle("PRIMARY")
        .setEmoji("🔇")
  }

  async ChannelsButtons(message: any) {
    return new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId("LogChannel")
          .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:ChannelsButtons:Logs", message))
          .setEmoji("🗞")
          .setStyle("PRIMARY")
        ),
        new Discord.MessageButton()
          .setCustomId("FloodChannel")
          .setLabel(await this.client.translate("⚙ Settings/setup:Buttons:Labels:ChannelsButtons:Flood", message))
          .setEmoji("😵")
          .setStyle("PRIMARY")
  }
}