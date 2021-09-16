import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";

export default class Setup {
  client: NDBClient;

  constructor(client: NDBClient) {
    this.client = client;
  }

  async HomeEmbed(message: Discord.Message): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setColor('#00c26f')
      .setTitle(await this.client.translate('⚙ Settings/setup:Menu:Title', message))
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(await this.client.translate('⚙ Settings/setup:Menu:Description', message))
      .addFields(
        {
          name: await this.client.translate('⚙ Settings/setup:Menu:Fields:1', message),
          value: await this.client.translate('⚙ Settings/setup:Menu:Fields:Content:1', message)
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Menu:Fields:2', message),
          value: await this.client.translate('⚙ Settings/setup:Menu:Fields:Content:2', message)
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Menu:Fields:3', message),
          value: await this.client.translate('⚙ Settings/setup:Menu:Fields:Content:3', message)
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Menu:Fields:4', message),
          value: await this.client.translate('⚙ Settings/setup:Menu:Fields:Content:4', message)
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Menu:Fields:5', message),
          value: await this.client.translate('⚙ Settings/setup:Menu:Fields:Content:5', message)
        }
      )
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
  }

  async InfoEmbed(message: Discord.Message, prefix: any, language: string, DefaultRole: string, MutedRole: string, LogChannel: string, FloodChannel: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setColor('#00c26f')
      .setTitle(await this.client.translate('⚙ Settings/setup:Info:Title', message))
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(await this.client.translate('⚙ Settings/setup:Info:Description', message))
      .addFields(
        {
          name: await this.client.translate('⚙ Settings/setup:Info:Fields:1', message),
          value: prefix
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Info:Fields:2', message),
          value: language
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Info:Fields:3', message),
          value: await this.client.translate('⚙ Settings/setup:Info:Fields:Content:3', message, { DefaultRole: DefaultRole })
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Info:Fields:4', message),
          value: await this.client.translate('⚙ Settings/setup:Info:Fields:Content:4', message, { MutedRole: MutedRole })
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Info:Fields:5', message),
          value: await this.client.translate('⚙ Settings/setup:Info:Fields:Content:5', message, { LogChannel: LogChannel })
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Info:Fields:6', message),
          value: await this.client.translate('⚙ Settings/setup:Info:Fields:Content:6', message, { FloodChannel: FloodChannel })
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Info:Fields:7', message),
          value: await this.client.translate('⚙ Settings/setup:Info:Fields:Content:7', message)
        }
      )
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
  }

  async GeralEmbed(message: Discord.Message): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setColor('#00c26f')
      .setTitle(await this.client.translate('⚙ Settings/setup:Geral:Embed:Title', message))
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(await this.client.translate('⚙ Settings/setup:Geral:Embed:Description', message))
      .addFields(
        {
          name: await this.client.translate('⚙ Settings/setup:Geral:Embed:Fields:1', message),
          value: await this.client.translate('⚙ Settings/setup:Geral:Embed:Fields:Content:1', message)
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Geral:Embed:Fields:2', message),
          value: await this.client.translate('⚙ Settings/setup:Geral:Embed:Fields:Content:2', message)
        },
        {
          name: await this.client.translate('⚙ Settings/setup:Geral:Embed:Fields:3', message),
          value: await this.client.translate('⚙ Settings/setup:Geral:Embed:Fields:Content:3', message)
        }
      )
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
  }

  async PrefixEmbed(message: Discord.Message, prefix: any): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate('⚙ Settings/setup:Geral:Prefix:Title', message))
      .setColor('#00c26f')
      .setDescription(await this.client.translate('⚙ Settings/setup:Geral:Prefix:Description', message, { PREFIX: prefix }))
      .setTimestamp()
  }

  async newPrefixEmbed(message: Discord.Message, prefix: any): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate('⚙ Settings/setup:Geral:Prefix:New:Title', message))
      .setColor('#00c26f')
      .setDescription(await this.client.translate('⚙ Settings/setup:Geral:Prefix:New:Description', message, { PrefixFMsg: prefix }))
      .addFields({
        name: await this.client.translate('⚙ Settings/setup:Geral:Prefix:New:Fields:1', message),
        value: await this.client.translate('⚙ Settings/setup:Geral:Prefix:New:Fields:Content:1', message)
      })
      .setTimestamp()
  }

  async LanguageEmbed(message: Discord.Message, language: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate('⚙ Settings/setup:Geral:Language:Title', message))
      .setColor('#00c26f')
      .setDescription(await this.client.translate('⚙ Settings/setup:Geral:Language:Description', message, { LANGUAGE: language }))
      .setTimestamp()
  }

  async newLanguageEmbed(message: Discord.Message, language: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate('⚙ Settings/setup:Geral:Language:New:Title', message))
      .setColor('#00c26f')
      .setDescription(await this.client.translate('⚙ Settings/setup:Geral:Language:New:Description', message, { LANGUAGE: this.client.MongoDB.DataCheckLanguage(language) }))
      .addFields({
        name: await this.client.translate('⚙ Settings/setup:Geral:Language:New:Fields:1', message),
        value: await this.client.translate('⚙ Settings/setup:Geral:Language:New:Fields:Content:1', message)
      })
      .setTimestamp()
  }

  async RolesEmbed(message: Discord.Message): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setTitle(await this.client.translate("⚙ Settings/setup:Roles:Menu:Title", message))
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(await this.client.translate("⚙ Settings/setup:Roles:Menu:Description", message))
      .addFields(
        { name: await this.client.translate("⚙ Settings/setup:Roles:Menu:Fields:1", message), value: await this.client.translate("⚙ Settings/setup:Roles:Menu:Fields:Content:1", message) },
        { name: await this.client.translate("⚙ Settings/setup:Roles:Menu:Fields:2", message), value: await this.client.translate("⚙ Settings/setup:Roles:Menu:Fields:Content:2", message) },
        { name: await this.client.translate("⚙ Settings/setup:Roles:Menu:Fields:3", message), value: await this.client.translate("⚙ Settings/setup:Roles:Menu:Fields:Content:3", message) },
      )
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
  }

  async DREmbed(message: Discord.Message, DefaultRole: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate("⚙ Settings/setup:Roles:Default:Title", message))
      .setColor("#00c26f")
      .setDescription(await this.client.translate("⚙ Settings/setup:Roles:Default:Title", message, { DefaultRole: DefaultRole }))
      .setTimestamp();
  }

  async newDREmbed(message: Discord.Message, DRFMsg: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate("⚙ Settings/setup:Roles:Default:New:Title", message))
      .setColor("#00c26f")
      .setDescription(await this.client.translate("⚙ Settings/setup:Roles:Default:New:Description", message, { DRFMsg: DRFMsg }))
      .addFields({
        name: await this.client.translate("⚙ Settings/setup:Roles:Default:New:Fields:1", message),
        value: await this.client.translate('⚙ Settings/setup:Roles:Default:New:Fields:Content:2', message)
      })
      .setTimestamp();
  }

  async MREmbed(message: Discord.Message, MutedRole: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate("⚙ Settings/setup:Roles:Mute:Title", message))
      .setColor("#00c26f")
      .setDescription(await this.client.translate("⚙ Settings/setup:Roles:Mute:Title", message, { MutedRole: MutedRole }))
      .setTimestamp();
  }

  async newMREmbed(message: Discord.Message, MRFMsg: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate("138846775Roles:Mute:New:Title", message))
      .setColor("#00c26f")
      .setDescription(await this.client.translate("⚙ Settings/setup:Roles:Mute:New:Description", message, { MRFMsg: MRFMsg }))
      .addFields({
        name: await this.client.translate("⚙ Settings/setup:Roles:Mute:New:Fields:1", message),
        value: await this.client.translate('⚙ Settings/setup:Roles:Mute:New:Fields:Content:2', message)
      })
      .setTimestamp();
  }

  async ChannelsEmbed(message: Discord.Message): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setTitle(await this.client.translate("⚙ Settings/setup:Channels:Menu:Title", message))
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(await this.client.translate("⚙ Settings/setup:Channels:Menu:Description", message))
      .addFields(
        { name: await this.client.translate("⚙ Settings/setup:Channels:Menu:Fields:1", message), value: await this.client.translate("⚙ Settings/setup:Channels:Menu:Fields:Content:1", message) },
        { name: await this.client.translate("⚙ Settings/setup:Channels:Menu:Fields:2", message), value: await this.client.translate("⚙ Settings/setup:Channels:Menu:Fields:Content:2", message) },
        { name: await this.client.translate("⚙ Settings/setup:Channels:Menu:Fields:3", message), value: await this.client.translate("⚙ Settings/setup:Channels:Menu:Fields:Content:3", message) },
      )
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
  }

  async LCEmbed(message: Discord.Message, LogChannel: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate("⚙ Settings/setup:Channels:Logs:Title", message))
      .setColor("#00c26f")
      .setDescription(await this.client.translate("⚙ Settings/setup:Channels:Logs:Description", message, { LogChannel: LogChannel }))
      .setTimestamp();
  }

  async newLCEmbed(message: Discord.Message, LCFMsg: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate("⚙ Settings/setup:Channels:Logs:New:Title", message))
      .setColor("#00c26f")
      .setDescription(await this.client.translate("⚙ Settings/setup:Channels:Logs:New:Title", message, { LCFMsg: LCFMsg }))
      .addFields({ name: await this.client.translate("⚙ Settings/setup:Channels:Logs:New:Fields:1", message), value: await this.client.translate("⚙ Settings/setup:Channels:Logs:New:Fields:Content:1", message) })
      .setTimestamp();
  }

  async FCEmbed(message: Discord.Message, FloodChannel: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate("⚙ Settings/setup:Channels:Flood:Title", message))
      .setColor("#00c26f")
      .setDescription(await this.client.translate("⚙ Settings/setup:Channels:Flood:Description", message, { FloodChannel: FloodChannel }))
      .setTimestamp();
  }

  async newFCEmbed(message: Discord.Message, FCFMsg: string): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setTitle(await this.client.translate("⚙ Settings/setup:Channels:Flood:New:Title", message))
      .setColor("#00c26f")
      .setDescription(await this.client.translate("⚙ Settings/setup:Channels:Flood:New:Description", message, { FCFMsg: FCFMsg }))
      .addFields({ name: await this.client.translate("⚙ Settings/setup:Channels:Flood:New:Fields:1", message), value: await this.client.translate("⚙ Settings/setup:Channels:Flood:New:Fields:Content:1", message) })
      .setTimestamp();
  }

  async SystemEmbed(message: Discord.Message): Promise<Discord.MessageEmbed> {
    return new Discord.MessageEmbed()
      .setColor("#00c26f")
      .setTitle(await this.client.translate("⚙ Settings/setup:System:Menu:Title", message))
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(await this.client.translate("⚙ Settings/setup:System:Menu:Description", message))
      .addFields(
        { name: await this.client.translate("⚙ Settings/setup:System:Menu:Fields:1", message), value: await this.client.translate("⚙ Settings/setup:System:Menu:Fields:Content:1", message) },
        { name: await this.client.translate("⚙ Settings/setup:System:Menu:Fields:2", message), value: await this.client.translate("⚙ Settings/setup:System:Menu:Fields:Content:2", message) },
        { name: await this.client.translate("⚙ Settings/setup:System:Menu:Fields:3", message), value: await this.client.translate("⚙ Settings/setup:System:Menu:Fields:Content:3", message) },
        { name: await this.client.translate("⚙ Settings/setup:System:Menu:Fields:4", message), value: await this.client.translate("⚙ Settings/setup:System:Menu:Fields:Content:4", message) },
      )
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
  }
}
