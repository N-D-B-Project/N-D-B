import { ConfigType } from "~/Types";
import "dotenv/config";

export const Config: ConfigType = {
  Prefix: "&",
  Owners: ["330047048009252864"],
  TestGuilds: { ID: ["717094267243462688"] },
  NDB_Bugs: ["800847836139880458", "800847760046948370"],
  ServerOnly: {
    ID: ["679066351456878633"],
  },
  Sharding: {
    enable: false,
    spawnDelay: 5,
    spawnTimeout: 300,
    serversPerShard: 1000,
    shardCount: 1,
    callbackUrl: "http://localhost:8888/",
    RootServiceUrl: "http://localhost:5008/",
  },
  Music: {
    Lavalink: true,
    Player: {
      AutoLeaveEmpty: {
        Channel: {
          Enable: true,
          Delay: 60000,
        },
        Queue: {
          Enable: true,
          Delay: 30000,
        },
      },
    },
    Client: {
      selfDeaf: true,
      serverDeaf: true,
    },
  },
  APIs: {
    SCAPI: {
      Jobs: {
        ScheduleCluster: "0 */1 * * * *",
        ScheduleServer: "0 */5 * * * *",
        Log: true,
      },
      Port: 5008,
      Port2: 8888,
    },
  },
  Debug: {
    Client: true,
    DatabaseSave: true,
    SlashCommands: false,
    Sharding: {
      enable: false,
      mode: "process",
    },
  },
};
