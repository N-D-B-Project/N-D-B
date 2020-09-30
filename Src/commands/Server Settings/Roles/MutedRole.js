const BaseCommand = require("../../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require("../../../database/schemas/GuildConfig");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


module.exports = class SetDefaultRoleCommand extends BaseCommand {
  constructor() {
    super('setmutedrole', 'Server Settings', []);
  }

  async run(client, message, args) {
    if(message.member.hasPermission("MANAGE_GUILD")) {
        const guildConfig = await GuildConfig.findOne({
          guildId: message.guild.id
        })
        const FindRole = guildConfig.mutedRole;
        const Role = message.guild.roles.cache.find(r => r.id === `${FindRole}`);
        const SintaxErrEmbed = new Discord.MessageEmbed()
          .setTitle("❌ | Erro de Sintaxe")
          .setColor("RANDOM")
          .setDescription("Utilize: "+guildConfig.prefix+"setmutedrole <Cargo ID>")
          .setTimestamp();
        if(!args[0]) return message.channel.send(SintaxErrEmbed)
        
        guildConfig.mutedRole = args[0]
        guildConfig.save().catch((err) => console.log("SetRole Error: " + err))

        const SetRoleEmbed = new Discord.MessageEmbed()
          .setTitle("✔ | Cargo Definido!")
          .setColor("RANDOM")
          .setDescription("Cargo definido como: " + "<@&"+Role+">")
          .setTimestamp();
        message.channel.send(SetRoleEmbed)
  
      } else {
        message.channel.send("Você não tem permissão para utilizar este comando")
      }
  }
}