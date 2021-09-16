import NDBClient from "@/Client/Client";
import { CommandOptions } from "@Types/Options";
import { BaseCommand } from "@Structures/BaseCommand";
import Tools from "@Tools/Tools";
import * as Discord from "discord.js";

module.exports = class Command extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const name = "setup";
    const options: CommandOptions = {
      client: client,
      name: 'setup',
      aliases: ['configurar'],
      description: 'Configure o Bot utilizando esse comando',
      category: '⚙ Settings',
      usage: '',
      userPerms: ['MANAGE_GUILD'],
      botPerms: [''],
    };
    super(client, name, options, args);
  }

  async run(client: NDBClient, message: any, args: any, tools: Tools) {
    const guildConfig = await client.MongoDB.FindGuildConfig(message.guild);
    const prefix = client.MongoDB.DataCheck(guildConfig.get('Settings.Prefix'));
    const language = client.MongoDB.DataCheckLanguage(guildConfig.get('Settings.Language'));
    const DefaultRole = client.MongoDB.DataCheckRoles(guildConfig.get('Roles.Default'));
    const MutedRole = client.MongoDB.DataCheckRoles(guildConfig.get('Roles.Muted'));
    const LogChannel = client.MongoDB.DataCheckChannels(guildConfig.get('Channels.Logs'));
    const FloodChannel = client.MongoDB.DataCheckChannels(guildConfig.get('Channels.Flood'));

    const Timer = 120000

    try {

      const HomeEmbed = await client.Tools.embeds.setup.HomeEmbed(message);
      const AllButtons = await client.Tools.buttons.setup.AllButtons(message);
      const HomeButton = await client.Tools.buttons.setup.HomeButton(message);
      const HE = await message.reply({ embeds: [HomeEmbed], components: [AllButtons] });
      const filter = (interaction) => interaction.user.id === message.author.id;

      const collector = HE.createMessageComponentCollector({ filter, componentType: "BUTTON", time: Timer });

      collector.on('collect', async (interaction) => {
        if (interaction.user.id !== message.author.id) return;

        const ComponentReaction = interaction.customId

        switch (ComponentReaction) {
          /* Infos */ case "Info":
            const InfoEmbed = await client.Tools.embeds.setup.InfoEmbed(message, prefix, language, DefaultRole, MutedRole, LogChannel, FloodChannel)
            HE.edit({ embeds: [InfoEmbed], components: [HomeButton] })
            break
          /* Geral */ case "Geral":
            const GeralEmbed = await client.Tools.embeds.setup.GeralEmbed(message);
            const GeralButtons = await client.Tools.buttons.setup.GeralButtons(message);
            HE.edit({ embeds: [GeralEmbed], components: [HomeButton, GeralButtons] })
            const GeralFilter = (interaction) => interaction.user.id === message.author.id
            const collector = HE.createMessageComponentCollector({
              GeralFilter,
              max: 1,
              time: Timer
            })
            collector.on('collect', async (interaction: Discord.MessageComponentInteraction) => {
              const ComponentReaction = interaction.customId
              switch (ComponentReaction) {
              /* Prefix */ case 'Prefix':
                  const PrefixEmbed = await client.Tools.embeds.setup.PrefixEmbed(message, prefix)
                  HE.edit({ embeds: [PrefixEmbed], components: [] })
                  const PrefixResponseFilter = (msg) => msg.author.id === message.author.id
                  const PrefixResponse = await message.channel.awaitMessages({ PrefixResponseFilter, max: 1, time: 30000, errors: ['time'] })
                  const PrefixFMsg = PrefixResponse.first().content
                  const newPrefixEmbed = await client.Tools.embeds.setup.newPrefixEmbed(message, PrefixFMsg)
                  PrefixResponse.first().delete()
                  guildConfig.Settings.Prefix = PrefixFMsg
                  HE.edit({ embeds: [newPrefixEmbed], components: [HomeButton] })
                  break
              /* Language */ case 'Language':
                  const LanguageEmbed = await client.Tools.embeds.setup.LanguageEmbed(message, language)
                  const LanguageSelections = await client.Tools.selections.setup.LanguageSelections(message)
                  HE.edit({ embeds: [LanguageEmbed], components: [LanguageSelections] })
                  const LanguageFilter = (msg) => msg.author.id === message.author.id
                  const collector = HE.createMessageComponentCollector({ LanguageFilter, componentType: "SELECT_MENU", time: Timer })

                  collector.on('collect', async (SelectionInteraction) => {
                    if (SelectionInteraction.user.id !== message.author.id) return
                    const ComponentReaction = SelectionInteraction.values[0]

                    switch (ComponentReaction) {
                      case 'PTBR':
                        var lang = 'pt-BR'
                        guildConfig.Settings.Language = lang
                        var newLanguageEmbed = await client.Tools.embeds.setup.newLanguageEmbed(message, lang)
                        HE.edit({ embeds: [newLanguageEmbed], components: [HomeButton] })
                        break
                      case 'en-US':

                        break
                    }
                  })
                  break
              }
            })
            break
          /* Roles */ case "Roles":
            const RolesEmbed = await client.Tools.embeds.setup.RolesEmbed(message);
            const RolesButtons = await client.Tools.buttons.setup.RolesButtons(message);
            HE.edit({ embeds: [RolesEmbed], components: [RolesButtons] })
            const RolesFilter = (interaction) => interaction.user.id === message.author.id
            const RolesCollector = HE.createMessageComponentCollector({
              RolesFilter,
              max: 1,
              time: Timer
            })
            RolesCollector.on('collect', async (interaction: Discord.MessageComponentInteraction) => {
              const ComponentReaction = interaction.customId
              switch (ComponentReaction) {
                /* Default */ case "DefaultRole":
                  const DREmbed = await client.Tools.embeds.setup.DREmbed(message, DefaultRole)
                  HE.edit({ embeds: [DREmbed], components: [] })
                  const DRResponse = await message.channel.awaitMessages(
                    (msg) => msg.author.id === message.author.id,
                    {
                      max: 1,
                      time: 30000,
                    }
                  );
                  const DRFMsg = DRResponse.first().mentions.roles.first().id
                  const newDREmbed = await client.Tools.embeds.setup.newDREmbed(message, DRFMsg)
                  DRResponse.first().delete()
                  HE.edit({ embeds: [newDREmbed], components: [HomeButton] })
                  guildConfig.Roles.Default = DRFMsg
                  break;
                /* Muted */ case "MutedRole":
                  const MREmbed = await client.Tools.embeds.setup.MREmbed(message, MutedRole)
                  HE.edit({ embeds: [MREmbed], components: [] })
                  const MRResponse = await message.channel.awaitMessages(
                    (msg) => msg.author.id === message.author.id,
                    {
                      max: 1,
                      time: 30000,
                    }
                  );
                  const MRFMsg = MRResponse.first().mentions.roles.first().id
                  const newMREmbed = await client.Tools.embeds.setup.newMREmbed(message, MRFMsg)
                  DRResponse.first().delete()
                  HE.edit({ embeds: [newMREmbed], components: [HomeButton] })
                  guildConfig.Roles.Muted = DRFMsg
                  break;
              }
            })
            break;
          /* Channels */ case "Channels":
            const ChannelsEmbed = await client.Tools.embeds.setup.ChannelsEmbed(message)
            const ChannelButtons = await client.Tools.buttons.setup.ChannelsButtons(message)
            HE.edit({ embeds: [ChannelsEmbed], components: [ChannelButtons] })
            const ChannelsFilter = (interaction) => interaction.user.id === message.author.id
            const ChannelsCollector = HE.createMessageComponentCollector({
              ChannelsFilter,
              max: 1,
              time: Timer
            })
            ChannelsCollector.on('collect', async (interaction: Discord.MessageComponentInteraction) => {
              const ComponentReaction = interaction.customId
              switch (ComponentReaction) {
                /* Logs */ case "LogChannel":
                  const LCEmbed = await client.Tools.embeds.setup.LCEmbed(message, LogChannel);
                  HE.edit({ embeds: [LCEmbed], components: [] });
                  const LCResponse = await message.channel.awaitMessages(
                    (msg) => msg.author.id === message.author.id,
                    {
                      max: 1,
                      time: 30000,
                    }
                  );
                  const LCFMsg = LCResponse.first().mentions.channels.first().id
                  const newLCEmbed = await client.Tools.embeds.setup.newLCEmbed(message, LCFMsg);
                  HE.edit({ embeds: [newLCEmbed], components: [HomeEmbed] });
                  LCResponse.first().delete()
                  guildConfig.Channels.Logs = LCFMsg
                  break;
                /* Flood */ case "FloodChannel":
                  const FCEmbed = await client.Tools.embeds.setup.FCEmbed(message, FloodChannel);
                  HE.edit({ embeds: [FCEmbed], components: [] });
                  const FCResponse = await message.channel.awaitMessages(
                    (msg) => msg.author.id === message.author.id,
                    {
                      max: 1,
                      time: 30000,
                    }
                  );
                  const FCFMsg = FCResponse.first().mentions.channels.first().id
                  const newFCEmbed = await client.Tools.embeds.setup.newFCEmbed(message, FCFMsg);
                  HE.edit({ embeds: [newFCEmbed], components: [HomeEmbed] });
                  LCResponse.first().delete()
                  guildConfig.Channels.Logs = LCFMsg
                  break;
              }
            })
            break;
          /* Systens */ case "Systens":
            const SystemEmbed = await client.Tools.embeds.setup.SystemEmbed(message)
            HE.edit({ embeds: [SystemEmbed], components: [HomeButton] })

            const filter = (interaction) => interaction.user.id === message.author.id;
            const SystemCollector = HE.createMessageComponentCollector({ filter, componentType: "BUTTON", time: Timer })

            SystemCollector.on('collect', async (interaction) => {
              if (interaction.user.id !== message.author.id) return;

              const ComponentReaction = interaction.customId


            })
            break;
          /*  */
          /* Menu  */ case 'Menu':
            HE.edit({ embeds: [HomeEmbed], components: [AllButtons] })
            break
        }
      })

      setInterval(() => {
        guildConfig.save().catch((err) => client.logger.error('GuildConfig Save Error: ' + err))
        // if(client.config.Debug.DatabaseSave === true) client.logger.debug("Setup: DB Atualizada ")
      }, 1000) //! Save DBs every 1 second to prevent some bugs...

    } catch (error) {
      client.logger.error(error)
    }

  }

  async SlashRun() {

  }
};
