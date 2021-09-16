import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";

export default class SetupButtons {
  client: NDBClient;

  constructor(client) {
    this.client = client;
  }

  async LanguageSelections(message: any) {
    return new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId('Languages')
          .setPlaceholder(await this.client.translate('Tools/Selections:Setup:Placeholder', message))
          .addOptions([
            {
              label: 'Português Brasileiro',
              value: 'PTBR',
              emoji: '🌎'
            }
          ])
      )
  }


}
