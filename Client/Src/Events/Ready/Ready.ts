import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { EventOptions } from "~/Types";
import { Config } from "~/Config/Config";
import { MessageTools } from "~/Utils/Tools";
import { NDC } from "@Database/Schemas";
import { EmbedBuilder } from "discord.js";

export default class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ready",
      type: "once",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient) {
    //* Logs
    client.logger.ready(`${client.user.tag} Está Online!`);
    client.logger.event(`${client.Collections.events.size} Events`);
    client.logger.command(`${client.Collections.commands.size} Commands`);

    const BotOwner = client.users.cache.get(Config.Owners[0]);
    const ReadyMSG = await MessageTools.send(BotOwner, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Estou Online")
          .addFields([
            {
              name: "Online em",
              value: String(client.readyAt),
            },
          ])
          .setColor("#00c26f")
          .setTimestamp(),
      ],
    });
    await client.Tools.WAIT(5000);
    ReadyMSG.delete();

    const FindNDC = await NDC.findOne({ Auth: process.env.AuthNDC });
    if (!FindNDC) {
      await new NDC({
        Auth: process.env.AuthNDC,
      }).save();
      client.logger.database(`NedcloarBR Community Database Updated`);
    }
  }
}
