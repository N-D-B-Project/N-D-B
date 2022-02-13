import NDBClient from "@Client/NDBClient";
import express from "express";

export default class RPC {
  constructor(private client: NDBClient) {
    this.client = client;
  }

  App() {
    const RPCApp = express();
    const Port = 5500;

    RPCApp.set("json spaces", 1);

    RPCApp.get("/N-D-B/RPCStatus/info", (req, res) => {
      res.json({
        gld: this.client.guilds.cache.size,
        usr: this.client.users.cache.size,
      });
    });

    RPCApp.listen(Port, () => {
      this.client.logger.ready(`RPCApp Online on Port: ${Port}`);
    });
  }
}
