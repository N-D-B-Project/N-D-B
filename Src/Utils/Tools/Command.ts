import NDBClient from "@/Client/Client";

export default class Command {
  private client: NDBClient;

  constructor(client) {
    this.client = client;
  }

  resolveCommand(nameOrAlias: string) {
    return (
      this.client.collections.commands.get(nameOrAlias) ??
      this.client.collections.commands.get(this.client.collections.aliases.get(nameOrAlias)!)
    );
  }

  async ownerOnly(command, message) {
    if (
      command.options.ownerOnly &&
      !this.client.Tools.checkOwner(message.author.id)
    )
      return message.reply("Comando restrito para o Dono do Bot");
  }

  async guildOnly(command, message) {
    if (command.options.guildOnly && !message.guild)
      return message.reply("Comando Restrito para outro Servidor");
  }

  async nsfw(command, message) {
    if (command.options.nsfw && !message.channel.nsfw)
      return message.reply("Esse Comando só pode ser executado em canais NSFW");
  }

  async disable(command, message) {
    if (command.options.disable === true)
      return message.reply("Esse comando está desabilitado");
  }

  //@ Desabilitado por conta da "Tool" fortmatArray estar desativada
  async checkPerms(command, message) {
    // if (message.guild) {
    //   const userPermCheck = command.options.userPerms
    //     ? this.client.defaultPerms.add(command.options.userPerms)
    //     : this.client.defaultPerms;
    //   if (userPermCheck) {
    //     const missing = message.channel
    //       .permissionsFor(message.member)
    //       .missing(userPermCheck);
    //     if (missing.length) {
    //       return message.reply(
    //         `You are missing ${this.client.Tools.formatArray(
    //           missing.map(this.client.Tools.formatPerms)
    //         )} permissions, you need them to use this command!`
    //       );
    //     }
    //   }
    //   const botPermCheck = command.options.botPerms
    //     ? this.client.defaultPerms.add(command.options.botPerms)
    //     : this.client.defaultPerms;
    //   if (botPermCheck) {
    //     const missing = message.channel
    //       .permissionsFor(message.member)
    //       .missing(botPermCheck);
    //     if (missing.length) {
    //       return message.reply(
    //         `Faltam as seguintes Permissões: ${this.client.Tools.formatArray(
    //           missing.map(this.client.Tools.formatPerms)
    //         )} Para executar esse Comando!`
    //       );
    //     }
    //   }
    // }
  }
}
