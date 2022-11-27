import NDBClient from "@Client/NDBClient";
import { connect, connection, Document } from "mongoose";
import { ChannelType, Guild, Interaction, Message, User } from "discord.js";

export default class Database {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async Load() {
    await this.Mongoose();
  }

  async Mongoose() {
    const ConnectOptions = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    connect(process.env.MongoURI, ConnectOptions);

    connection.on("connected", () => {
      this.client.logger.database("MongoDB Connected!");
    });

    connection.on("err", (err) => {
      this.client.logger.error(`Mongoose Connection error: ${err.stack}`);
    });

    connection.on("disconnected", () => {
      this.client.logger.error(`Mongoose Connection lost`);
    });
  }
}
