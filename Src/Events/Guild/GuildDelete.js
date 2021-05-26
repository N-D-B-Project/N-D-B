const BaseEvent = require('../../Utils/Structures/BaseEvent');
const GuildConfig = require('../../Database/Schema/GuildConfig');
const GuildConfigRoles = require('../../Database/Schema/GuildRoles');
const GuildConfigChannels = require('../../Database/Schema/GuildRoles');

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
        name: 'guildDelete'
    });
  }
  
  async run(client, guild) {
    //! GuildConfigs
    try {
      const guildConfig = await GuildConfig.deleteOne({
        guildId: guild.id,
      });
      const guildConfigRoles = await GuildConfigRoles.deleteOne({
        guildId: guild.id,
      });
      const guildConfigChannels = await GuildConfigChannels.deleteOne({
        guildId: guild.id,
      });
      client.logger.dtb(`N-D-B Saiu do Server ${guild.name}. Database Atualizada!`);
    } catch (err) {
      client.logger.error(err);
    }
  }
}