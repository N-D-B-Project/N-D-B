// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class VoiceStateUpdateEvent extends BaseEvent {
  constructor() {
    super('voiceStateUpdate');
  }
  
  async run(client, oldState, newState) {
    if (client.config.settings.leaveOnEmpty_Channel.enabled && oldState && oldState.channel) {
      const player = client.music.players.get(oldState.guild.id);
      if (player && oldState.guild.channels.cache.get(player.voiceChannel).members.size === 1){
          setTimeout(()=>{
              if (player && oldState.guild.channels.cache.get(player.voiceChannel).members.size === 1){
              client.channels.cache
                .get(player.textChannel)
                .send(`Eu sai do Canal: \`${client.channels.cache.get(player.voiceChannel).name}\` Pois o Canal ficou vazio por: \`${ms(client.config.settings.leaveOnEmpty_Channel.time_delay, {long: true})}\``);
              player.destroy();
              }
          }, client.config.settings.leaveOnEmpty_Channel.time_delay);
      }
    }
  }
}