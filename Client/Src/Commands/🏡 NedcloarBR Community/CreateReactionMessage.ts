import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import { MessageTools, InteractionTools } from "@Utils/Tools";
import { BaseCommand } from "@Utils/Structures";
import { NDC } from "@Database/Schemas";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message,
  TextChannel,
} from "discord.js";

export default class CRMCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "CRM",
      aliases: ["CRM"],
      description: "CRM",
      category: "🏡 NedcloarBR Community",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages", "EmbedLinks", "AddReactions"],
        user: ["SendMessages", "Administrator"],
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: true,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0,
      DM: false,
      // SlashOptions: {
      //   name: "",
      //   ephemeral: true,
      //   description: "",
      // },
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    await message.delete();

    const FindNDC = await NDC.findOne({ Auth: process.env.AuthNDC });
    var MainMsg = await FindNDC.get("RoleMsgId");

    var MSGString = `Reaja de acordo com o cargo desejado!\n⠀⠀⠀⠀⠀⠀⠀⠀⠀\n***Notificações***\n<:youtube:730741995416453150>  |  <@&824061150475845673>\n<:twitch:998725252098052197>  |  <@&824061165415956510>\n<:twitter:998725250311258182>  |  <@&824061167294873630>\n⠀⠀⠀⠀⠀⠀⠀⠀\n***Geral***\n💻  |  <@&796380251721957407>\n🖥️  |  <@&998730204258250762>\n📱  |  <@&796380252481126420>\n🎧  |  <@&796380253064396831>\n⏯️  |  <@&796380253542416386>\n🖌️  |  <@&796380254616682566>\n🐺  |  <@&796380249143246859>\n😶  |  <@&796380250870251529>\n⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

    const channel = message.guild.channels.cache.get(
      "796380293257887794"
    ) as TextChannel;
    if (MainMsg) {
      const msg = channel.messages.cache.get(String(MainMsg));
      msg.reactions.removeAll();
      await MessageTools.edit(msg, {
        content: MSGString,
      });
      await this.ReactFunction(client, msg);
    } else {
      const newMsg = await MessageTools.send(channel, { content: MSGString });
      await this.ReactFunction(client, newMsg);
      MainMsg = newMsg.id;
      FindNDC.save();
    }
  }

  async SlashRun(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}

  async ReactFunction(client: NDBClient, msg: Message) {
    msg.react("<:youtube:730741995416453150>");
    await client.Tools.WAIT(1000);
    msg.react("<:twitch:998725252098052197> ");
    await client.Tools.WAIT(1000);
    msg.react("<:twitter:998725250311258182>");
    await client.Tools.WAIT(1000);
    msg.react("💻");
    await client.Tools.WAIT(1000);
    msg.react("🖥️");
    await client.Tools.WAIT(1000);
    msg.react("📱");
    await client.Tools.WAIT(1000);
    msg.react("🎧");
    await client.Tools.WAIT(1000);
    msg.react("⏯️");
    await client.Tools.WAIT(1000);
    msg.react("🖌️");
    await client.Tools.WAIT(1000);
    msg.react("🐺");
    await client.Tools.WAIT(1000);
    msg.react("😶");
    await client.Tools.WAIT(1000);
  }
}
