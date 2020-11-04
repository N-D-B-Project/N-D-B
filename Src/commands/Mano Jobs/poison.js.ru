const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class PoisonCommand extends BaseCommand {
  constructor() {
    super(
        'poison', //name
        'Mano Jobs', //category
        [''], //aliases
        'poison <Nº do Poison> <Usuário> <Tempo> <Motivo>', //usage
        'Comando exclusivo do Server Mano Jobs Gamers\nAplica o Poison no usuário que infligiu as regras' //description
      );
  }

  async run(client, message, args) {

    const Membros = await message.guild.roles.cache.get(r => r.id === "647439532144328716")
    const Mention = message.author;
    const MsgSender = message.channel.send;

    var string = args.join(" ");

    let poisons = [
        {name: "1", id: "585579822361739300"},
        {name: "2", id: "585579080490025009"},
        {name: "3", id: "588131899960983552"},
        {name: "4", id: "585948636060319756"}
    ];

    const names = poisons.map(function(item) {
        return item["name"];
    });

    const ids = poisons.map(function(item) {
        return item["id"];
    });

    const role = message.guild.roles.cache.get(r => r.name === string);

    if (!message.member.role.cache.some(r => [
        "581637595717566464", // ADM
        "581849490038718465", // Final Boss
        "712764913977786448", // Mod
        "585566255403106313", // Auxiliar
        "601072099188015135", // Vigilante
        "744761005267091516", // YouTube Mod
        "644680011059822643"  // Staff
    ].includes(r.id))) {
        return MsgSender(`${Mention} este comando é restrito para a Staff!`)
    } else if(!args[0]) {
        return MsgSender(`${Mention} Digite o número do Poison após o comando!`)
    } else if(args[0] === "remover") {
        await message.member.role.remove(Membros);
        return await MsgSender(`${Mention} Poison Removido!`);
    } else if(!name.includes(string) || !role) {
        return MsgSender(`${Mention} Este Poison não existe!`)
    } else {
        try{
            await message.member.roles.remove(Membros);
            await message.member.roles.add(role);
            return await MsgSender(`${Mention} está com Poison! Aplicado por ${Mention}`)
        } catch (err) {
            console.log("Poison Error: " + err)
        }
    }
  }
}