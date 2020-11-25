// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
const BaseEvent = require('../../utils/structures/BaseEvent');

const { Util: { escapeMarkdown } } = require('discord.js');
const { diffWordsWithSpace } = require('diff');

module.exports = class MessageUodateEvent extends BaseEvent {
  constructor() {
    super('messageUpdate');
  }
  
  async run(client, message) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    })
    const FindChannel = guildConfig.deleteMsgChannelId;
    const Channel = client.channels.cache.get(`${FindChannel}`);
    //const Channel = client.channels.cache.get("731288262035112045");
    if(message.channel === Channel) return;
    if(message.author.bot) return;
    
    if(Channel) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Mensagem Atualizada")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addField("Editada no Canal", message.channel)
        .addField("Mensagem antiga", oldMessage)
        .addField("Nova Mensagem", newMessage)
        .setColor("RANDOM")
        .setTimestamp()
      Channel.send(embed)
  }
}

const Event = require('../../Structures/Event');
const MenuDocsEmbed = require('../../Structures/MenuDocsEmbed');
const { Util: { escapeMarkdown } } = require('discord.js');
const { diffWordsWithSpace } = require('diff');

module.exports = class extends Event {

	async run(old, message) {
		if (!message.guild || old.content === message.content || message.author.bot) return;

		const embed = new MenuDocsEmbed()
			.setColor('BLUE')
			.setAuthor(old.author.tag, this.client.user.displayAvatarURL({ dynamic: true }))
			.setTitle('Message Updated')
			.setDescription([
				`**❯ Message ID:** ${old.id}`,
				`**❯ Channel:** ${old.channel}`,
				`**❯ Author:** ${old.author.tag} (${old.author.id})`
			])
			.setURL(old.url)
			.splitFields(diffWordsWithSpace(escapeMarkdown(old.content), escapeMarkdown(message.content))
				.map(result => result.added ? `**${result.value}**` : result.removed ? `~~${result.value}~~` : result.value)
				.join(' '));

		const channel = message.guild.channels.cache.find(ch => ch.name === 'testing');
		if (channel) channel.send(embed);
	}

};