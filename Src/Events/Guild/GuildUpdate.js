const BaseEvent = require('../../Utils/Structures/BaseEvent');
const GuildConfig = require('../../Database/Schema/GuildConfig');
const GuildConfigRoles = require('../../Database/Schema/GuildRoles');
const GuildConfigChannels = require('../../Database/Schema/GuildRoles');

module.exports = class GuildUpdateEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
      name: 'guildUpdate'
    });
  }
  
  async run(client, oldGuild, newGuild) {
    const guildConfig = await GuildConfig.findOne({ guildId: newGuild.id });
    const guildConfigRoles = await GuildConfigRoles.findOne({ guildId: newGuild.id });
    const guildConfigChannels = await GuildConfigChannels.findOne({ guildId: newGuild.id });
    
    guildConfig.guildId = newGuild.id;
    guildConfig.guildName = newGuild.name;
    guildConfigRoles.guildId = newGuild.id;
    guildConfigRoles.guildName = newGuild.name;
    guildConfigChannels.guildId = newGuild.id;
    guildConfigChannels.guildName = newGuild.name;
    guildConfig.save()
    guildConfigRoles.save()
    guildConfigChannels.save()
    client.logger.dtb('Server: ' +oldGuild.name+ ' Foi atualizado e Salvo na DataBase!');
  }
}