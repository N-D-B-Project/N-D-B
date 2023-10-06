import { Config } from "@/Config/Config";
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { ActivityType, EmbedBuilder, PresenceData } from "discord.js";

export default class Event extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "ready",
      type: "once",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient) {
    if (Config.Music.Lavalink) {
      await client.MusicManager.load();
    }
    //* Logs
    await client.Tools.WAIT(2000);
    client.logger.event(`${client.Collections.events.size} Events`);
    client.logger.command(
      `${client.Collections.Commands.size} Message Commands`
    );
    client.logger.command(
      `${client.Collections.SlashCommands.size} (/) Slash Commands`
    );
    client.logger.command(
      `${client.Collections.SubCommands.size} (/) Sub Slash Commands`
    );

    const ReadyMSG = await MessageTools.send(
      client.users.cache.get(Config.Owners[0]),
      {
        embeds: [
          new EmbedBuilder()
            .setTitle("Estou Online")
            .addFields([
              {
                name: "Online em",
                value: String(client.readyAt)
              }
            ])
            .setColor("#00c26f")
            .setTimestamp()
        ]
      }
    );

    const presences: PresenceData = {
      activities: [
        {
          type: ActivityType.Custom,
          name: "WorkingAt",
          state: `${""}N-D-B | 🎵 Music Player - 🚧 WIP`,
          url: "https://discord.gg/5CHARxbaRk"
        },
        {
          type: ActivityType.Watching,
          name: "Best Bot of Discord"
        },
        {
          type: ActivityType.Streaming,
          name: "Watch my Creator Streams on Twitch!",
          url: "https://Twitch.TV/NedcloarBR"
        },
        {
          type: ActivityType.Custom,
          name: "TotalStatus",
          state: `👤 ${client.users.cache.size} Users - 🏠 ${client.guilds.cache.size} Guilds`
        }
      ],
      status: "dnd"
    };

    function setPresence() {
      const activity =
        presences.activities[
          Math.floor(Math.random() * presences.activities.length)
        ];
      client.user.setPresence({
        activities: [activity]
      });
    }
    setPresence();
    setInterval(() => setPresence(), 120_000);

    // console.log(
    //   client.guilds.cache.map(
    //     g => `Users: ${g.members.cache.size} - Name: ${g.name}`
    //   )
    // );
    await client.Tools.WAIT(5000);
    MessageTools.delete(ReadyMSG);
  }
}
