const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require("discord.js");
const mongoose = require("mongoose");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require("../../database/schemas/Blacklist")

module.exports = class BlacklistCommand extends BaseCommand {

    constructor(...args) {
        super(...args, {
            name: 'blacklist',
            usage: '[user]',
            category: 'Developer Tools',
            description: 'Coloca alguém na Blacklist do Bot',
            args: true,
            ownerOnly: true
        });
    }

    async run(client, message, args) {
        const Mention = message.mentions.members.first() 
          || message.guild.members.cache.get(args[0]) 
          || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(" ") 
          || x.user.username === args[0]);
        if (!Mention) {
            return message.channel.send('Mencione alguém ou utilize o ID da pessoa');
        }

        const userData = await User.findOne({ User: Mention.id });
        if (!userData) {
            const newUserData = new User({
                User: Mention.id,
                Blacklist: true
            });
            newUserData.save();
            return message.channel.send('O usuário foi **Adicionado** na Blacklist');
        } else {
            userData.Blacklist = false;
            userData.save();
            return message.channel.send('O usuário foi **Removido** na Blacklist');
        }
    }

};